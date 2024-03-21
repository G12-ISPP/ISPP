import React, { useState, useEffect } from "react";
import "./Post.css";
import Button, { BUTTON_TYPES } from "../Button/Button";

const backend = import.meta.env.VITE_APP_BACKEND;

const Post = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Si no hay token, el usuario no está autenticado
      setIsLoggedIn(false);
      alert("Debes iniciar sesión para acceder a la comunidad");
      window.location.href = "/login"; // Redirigir al usuario a la página de inicio de sesión
      return; // Detener el flujo de ejecución
    }

    // Si hay un token, se supone que el usuario está autenticado
    setIsLoggedIn(true);

    // Aquí realizar la petición para obtener el usuario mediante el token
    fetch(`${backend}/posts/get_user_from_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token: token }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.following);

        // Para cada usuario seguido, obtener sus posts
        if (Array.isArray(followedUsers)) {
          data.following.forEach((user) => {
            fetch(`${backend}/posts/get_post_by_user/${user}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => response.json())
              .then((userPosts) => {
                fetch(`${backend}/users/api/v1/users/${user}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((response) => response.json())
                  .then((user) => {
                    setUsername(user.username);
                    const userPostsWithName = userPosts.map((post) => ({
                      ...post,
                      users: user.username, // Reemplazar post.users con el nombre de usuario
                    }));

                    // Añadir userPostsWithName al estado de posts
                    setPosts((posts) => [...posts, ...userPostsWithName]);
                  });
              });
          });
        }
      });
  }, []);

  if (!isLoggedIn) {
    // Si el usuario no está autenticado, no se renderizará ningún contenido
    return null;
  }
  console.log(posts);
  posts.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  console.log(posts);
  return (
    <>
      <div className="introduccion">
        <h1 className="titulo-pagina">Comunidad</h1>

        <Button
          type={BUTTON_TYPES.LARGE}
          text="Añadir Post"
          path="/posts/add-post"
        />
      </div>
      <div className="post-container">
        {posts
          .sort((a, b) => b.id - a.id)
          .map((post, index) => {
            return (
              <div key={index} className="post-item">
                <div className="post-image-container">
                  <img src={post.image_url} alt="post" className="post-image" />
                </div>
                <div className="post-details">
                  <h3 className="post-title">{post.name}</h3>
                  <p className="post-description">{post.description}</p>
                  <p className="post-users">Publicado por: {post.users}</p>
                </div>
              </div>
            );
          })}
        {selectedImage && (
          <div className="modal">
            <div className="modal-content">
              <img src={selectedImage} alt="post" className="modal-image" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
