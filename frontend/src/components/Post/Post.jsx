import React, { useState, useEffect } from "react";
import "./Post.css";

const backend = import.meta.env.VITE_APP_BACKEND;

const Post = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]); // Añade esta línea
  console.log(backend);
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
    // Remove the closing parenthesis here
  }, []); // No need to add closing parenthesis here, it's already correct

  // Ahora puedes utilizar `followedUsers` en tu renderizado para mostrar la lista de usuarios que sigues
  return (
    <div>
      {posts.map((post) => {
        return (
          <div>
            <h3>{post.name}</h3>
            <p>{post.description}</p>
            <p>{post.users}</p>
          </div>
        ); // Add a closing parenthesis here
      })}
    </div>
  );
};

export default Post;
