import React, { useState, useEffect } from "react";
import Paginator from '../Paginator/Paginator';
import "./Post.css";
import Button, { BUTTON_TYPES } from "../Button/Button";
import { FcLikePlaceholder, FcLike  } from "react-icons/fc";
import ModalComment from "../ModalComment/ModalComment";
import PropTypes from 'prop-types';

const id = window.location.href.split('/')[4];
const backend = import.meta.env.VITE_APP_BACKEND;

const Post = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [liked, setLiked] = useState([])
  const [disliked, setDisliked] = useState([])
  const [wantComment, setWantComment] = useState(false);
  const [idPost, setIdPost] = useState(null);


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

    if (id) {
      fetch(`${backend}/posts/get_post_by_user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((userPosts) => {
          fetch(`${backend}/users/api/v1/users/${id}`, {
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
                users: user.username, // Incluir el nombre del usuario en el post
              }));

              // Añadir userPostsWithName al estado de posts
              setPosts((prevPosts) => [...prevPosts, ...userPostsWithName]);
            });
        });

    } else {
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
                      setPosts((prevPosts) => [...prevPosts, ...userPostsWithName]);
                    });
                });
            });
          }
        });
    }
  }, [liked, disliked]);

  const handleCommentModal = (id) => {
    setWantComment(!wantComment);
    setIdPost(id);
  };

  const handleDetail = (id) => {
    if (!id) {
        window.location.href = '/community';
    } else {
        window.location.href = '/community/post/' + id;
    }
}

  if (!isLoggedIn) {
    // Si el usuario no está autenticado, no se renderizará ningún contenido
    return null;
  }
  posts.sort((a, b) => b.id - a.id)

  const numPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  const handleOnClick = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="introduccion">
        <h1 className="titulo-pagina">
          {id ? `Comunidad: ${username}` : 'Comunidad'}
        </h1>

        <Button
          type={BUTTON_TYPES.LARGE}
          text="Añadir Post"
          path="/posts/add-post"
        />
      </div>
      <div className="post-container">
        {currentPosts
          .sort((a, b) => b.id - a.id)
          .map((post, index) => {
            const handleLike = () => {
              const token = localStorage.getItem("token");
              fetch(`${backend}/posts/like/${post.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: token }),
              })
                .then((res) => {
                  if (res.status === 200) {
                    setPosts(prevPosts => {
                      const updatedPosts = prevPosts.map(prevPost => {
                        if (prevPost.id === post.id) {
                          return {
                            ...prevPost,
                            likes: [...prevPost.likes, username] // Agregar el nombre de usuario a los likes del post
                          };
                        }
                        return prevPost;
                      });
                      return updatedPosts;
                    });
                  }
                });
            };

            const handleDeleteLike = () => {
              const token = localStorage.getItem("token");
              fetch(`${backend}/posts/delete-like/${post.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: token }),
              })
                .then((res) => {
                  if (res.status === 200) {
                    setPosts(prevPosts => {
                      const updatedPosts = prevPosts.map(prevPost => {
                        if (prevPost.id === post.id) {
                          return {
                            ...prevPost,
                            likes: prevPost.likes.filter(like => like !== username)
                          };
                        }
                        return prevPost;
                      });
                      return updatedPosts;
                    });
                  }
                });
            };


            return (
              <div key={index} className="post-item">
                <div className="post-image-container">
                  <img src={post.image_url} alt="post" className="post-image" />
                </div>
                <div className="post-details">
                  <h3 className="post-title">{post.name}</h3>
                  <p className="post-description">{post.description}</p>
                  <p className="post-users">Publicado por: {post.users}</p>
                  <hr/>
                  <div className="post-comments-like">
                    <p>
                      {post.likes.filter(like => like === username).length === 1 ?
                          <FcLike data-testid="like" onClick={handleDeleteLike}/> :
                          <FcLikePlaceholder data-testid="dislike" onClick={handleLike}/>
                      }
                      {post.likes.length}
                    </p>
                    <p>
                      <Button
                        type={BUTTON_TYPES.MEDIUM}
                        text="Comentar"
                        onClick={() => {
                          handleCommentModal(post.id);
                        }}
                      />
                      <Button
                        type={BUTTON_TYPES.MEDIUM}
                        text="Más detalles"
                        onClick={() => {
                          handleDetail(post.id);
                        }}
                      />
                    </p>
                  </div>
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

        {wantComment && (
          <ModalComment setWantComment={setWantComment} postId={idPost} />
        )}
        <Paginator page={page} setPage={handleOnClick} numPages={numPages} />

      </div>
    </>
  );
};

export default Post;
