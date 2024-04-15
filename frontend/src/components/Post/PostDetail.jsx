import React from "react";

import Text, { TEXT_TYPES } from "../Text/Text";
import PageTitle from '../PageTitle/PageTitle';
import "./PostDetail.css";
import Button, { BUTTON_TYPES } from "../Button/Button";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import ModalComment from "../ModalComment/ModalComment";

const backend = import.meta.env.VITE_APP_BACKEND;
const id = window.location.href.split('/')[5]

export default class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      likes: 0,
      comments: [],
      idPost: null,
      wantComment: false,
    };
  }

  async componentDidMount() {
    if (id) {
      const getPost = async () => {
        const petition = `${backend}/posts/get_post_by_id/${id}`;
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(petition, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Error al obtener el post');
          }
          const postData = (await response.json())[0];
          const userId = postData.users;
          const username = await getUsername(userId);
          const postWithUsername = { ...postData, username };
          const likes = postWithUsername.likes.length;
          this.setState({ post: postWithUsername, likes: likes });
        } catch (error) {
          console.error('Error al obtener el post:', error);
        }
      };

      const getComments = async () => {
        const petition = `${backend}/comment/get_comments/${id}`;
        const token = localStorage.getItem('token');

        try {
          const response = await fetch(petition, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Error al obtener los comentarios');
          }

          const comments = await response.json();

          const commentsWithUsernames = await Promise.all(comments.map(async comment => {
            const username = await getUsername(comment.user);
            return { ...comment, username: username };
          }));

          this.setState({ comments: commentsWithUsernames });
        } catch (error) {
          console.error('Error al obtener los comentarios:', error);
        }
      }

      const getUsername = async (userId) => {
        try {
          const id = 14;
          const petition = `${backend}/users/api/v1/users/${userId}/get_user_data/`;
          const response = await fetch(petition);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          return userData.username;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      getPost();
      getComments();
    }

  }

  render() {
    const { post, likes, comments, wantComment, idPost } = this.state;



    const handleLike = () => {
      const token = localStorage.getItem("token");
      fetch(`${backend}/posts/like/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: token }),
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              post: prevPosts => {
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
              }
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

    const handleCommentModal = (id) => {
      this.setState({ wantComment: true, idPost: id });
    };

    const setWantComment = (value) => {
      this.setState({ wantComment: value });
      this.componentDidMount();
    }

    return (
      <>
        <div className="post-detail-details-page">

          <PageTitle title="Detalles de la publicación" />

          <div className="post-detail-title-container">
            <Text type={TEXT_TYPES.TITLE_BOLD} text='Detalles de la publicación' />
          </div>

          <div className="post-detail-container">

            <div className="left-post-detail-container">
              <div className="post-detail-img-container">
                <img className='post-detail-image' src={post.image_url} alt={post.id} />
              </div>
            </div>

            <div className="right-post-detail-container">
              <div className="post-detail-info-container">

                <div className="post-detail-principal">
                  <h2 className="post-detail-info-name">{post.name}</h2>
                  <p>
                    <FcLikePlaceholder data-testid="dislike" />
                    {likes}
                  </p>
                </div>

                <div className="post-detail-info-owner">
                  <ProfileIcon key={post.users} name={post.username} onClick={post.users} showScore="False" userId={post.users} />
                </div>

                <div className="post-detail-info-description">
                  <h3 className="post-detail-info-description-label">Detalles:</h3>
                  <p className="post-detail-info-description-text">{post.description}</p>
                </div>
                <hr />
                <div className="post-comments">
                  <p>
                    <Button
                      type={BUTTON_TYPES.MEDIUM}
                      text="Comentar"
                      onClick={() => {
                        handleCommentModal(post.id);
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>

          </div>

          {wantComment && (
            <ModalComment setWantComment={setWantComment} postId={idPost} />
          )}

          <div className="post-detail-section">
            <Text type={TEXT_TYPES.TITLE_BOLD} text='Comentarios' />
            <div className="post-detail-comments">
              {comments.map(comment => (
                <div key={comment.id} className="post-detail-comment">
                  <div className="post-detail-comment-info">
                    <div className="post-detail-info-user">
                      <ProfileIcon key={comment.user} name={comment.username} onClick={comment.user} showScore="False" userId={comment.user} />
                    </div>
                    <p className="post-detail-comment-description">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </>

    );
  }
}