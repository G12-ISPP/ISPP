import React, { useState, useEffect } from "react";
import "./Post.css";

const backend = import.meta.env.VITE_APP_BACKEND;

const Post = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = (imageRoute) => {
    setSelectedImage(imageRoute);
  };

  useEffect(() => {
    // Aquí realizar la petición para obtener el usuario mediante el token
    const token = localStorage.getItem("token");
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
                // Añadir los posts del usuario a un estado de React
                setPosts((posts) => [...posts, ...userPosts]);
              });
          });
        }
      });
  }, []);

  return (
    <>
      <h1 className="titulo-pagina">Comunidad</h1>
      <div className="post-container">
        {posts.map((post, index) => {
          return (
            <div key={index} className="post-item">
              <div className="post-image-container" onClick={() => handleClick(post.imageRoute)}>
                <img src={`/public/images/${post.imageRoute}`} alt="post" className="post-image" />
              </div>
              <div className="post-details">
                <h3 className="post-title">{post.name}</h3>
                <p className="post-description">{post.description}</p>
                <p className="post-users">{post.users}</p>
              </div>
            </div>
          );
        })}
        {selectedImage && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setSelectedImage(null)}>
                &times;
              </span>
              <img src={`/public/images/${selectedImage}`} alt="post" className="modal-image" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
