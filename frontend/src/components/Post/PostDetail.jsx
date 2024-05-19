import React, {useState, useEffect} from "react";
import Text, {TEXT_TYPES} from "../Text/Text";
import PageTitle from "../PageTitle/PageTitle";
import "./PostDetail.css";
import Button, {BUTTON_TYPES} from "../Button/Button";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import {FcLikePlaceholder, FcLike} from "react-icons/fc";
import ModalComment from "../ModalComment/ModalComment";
import {getUsername} from "../../api/users.api.jsx";
import {useParams} from "react-router-dom";
import {getComments, getPost} from "../../api/community.api.jsx";

const backend = import.meta.env.VITE_APP_BACKEND;

export default function PostDetail(props) {
    const {id: idFromRoute} = useParams();
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [idPost, setIdPost] = useState(props.idPost || idFromRoute || null);
    const [wantComment, setWantComment] = useState(false);
    const [username, setUsername] = useState('')
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para acceder a la comunidad");
            window.location.href = "/login";
        }

        if (idPost && token) {
            getPost(idPost)
                .then((response) => response.json())
                .then(async (data) => {
                    const userId = data[0].users;
                    const username = await getUsername(userId);
                    const postWithUsername = {...data[0], username};
                    const likes = postWithUsername.likes.length;
                    setPost(postWithUsername);
                    setLikes(likes);
                })
                .catch((error) =>
                    console.error("Error al obtener el post:", error)
                );

            fetch(`${backend}/posts/get_user_from_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({token: token}),
            })
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                    setUsername(response.username)
                })

            getComments(idPost)
                .then((response) => response.json())
                .then(async (data) => {
                    const commentsWithUsernamesPromises = data.map(async (comment) => {
                        const username = await getUsername(comment.user);
                        return {...comment, username: username};
                    });
                    const commentsWithUsernames = await Promise.all(
                        commentsWithUsernamesPromises
                    );
                    setComments(commentsWithUsernames);
                })
                .catch((error) =>
                    console.error("Error al obtener los comentarios:", error)
                );
        }
    }, [idPost, liked]);

    const handleCommentModal = (id) => {
        setWantComment(true);
        setIdPost(id);
    };

    const addComment = async (comment) => {
        const username = await getUsername(comment.username);
        const newComment = {id: idPost, post: idPost, content: comment.comment, username, user: comment.username};

        setComments([...comments, newComment]);
    };

    const handleLike = () => {
        const token = localStorage.getItem("token");
        fetch(`${backend}/posts/like/${idPost}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({token: token}),
        })
            .then((res) => {
                if (res.status === 200) {
                    setLikes(likes + 1)
                    setLiked(!liked)
                }
            });
    };

    const handleDeleteLike = () => {
        const token = localStorage.getItem("token");
        fetch(`${backend}/posts/delete-like/${idPost}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({token: token}),
        })
            .then((res) => {
                if (res.status === 200) {
                    setLikes(likes - 1);
                    setLiked(!liked)
                }
            });
    };

    const hasAlreadyCommented = (comments) => {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].username === username) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="post-detail-details-page">
            <PageTitle title="Detalles de la publicación"/>

            <div className="post-detail-title-container">
                <Text type={TEXT_TYPES.TITLE_BOLD} text="Detalles de la publicación"/>
            </div>

            <div className="post-detail-container">

                <div className="left-post-detail-container">
                    <div className="post-detail-img-container">
                        <img className="post-detail-image" src={post.image_url} alt={post.id}/>
                    </div>
                </div>

                <div className="right-post-detail-container">
                    <div className="post-detail-info-container">
                        <div className="post-detail-principal">
                            <h2 className="post-detail-info-name">{post.name}</h2>
                        </div>

                        <div className="post-detail-info-owner">
                            {post.users && (
                                <ProfileIcon
                                    name={post.username}
                                    onClick={post.users}
                                    showScore="False"
                                    userId={post.users}
                                />
                            )}
                        </div>

                        <div className="post-detail-info-description">
                            <h3 className="post-detail-info-description-label">Detalles:</h3>
                            <p className="post-detail-info-description-text">{post.description}</p>
                            <h3>{post.likes?.filter(like => like === username).length === 1 ?
                                <FcLike className="post-likes" onClick={handleDeleteLike}/> :
                                <FcLikePlaceholder className="post-likes" onClick={handleLike}/>} {likes}</h3>
                        </div>

                        <div className="post-comments">
                            <p>
                                {
                                    !hasAlreadyCommented(comments) && <Button
                                        type={BUTTON_TYPES.MEDIUM}
                                        text="Comentar"
                                        onClick={() => {
                                            handleCommentModal(post.id);
                                        }}
                                    />
                                }

                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {wantComment && <ModalComment setWantComment={setWantComment} postId={idPost} addComment={addComment}/>}

            <div className="post-detail-section">
                <Text type={TEXT_TYPES.TITLE_BOLD} text="Comentarios"/>
                <div className="post-detail-comments">
                    {comments.length === 0 && (
                        <p className="post-detail-no-comments">No hay comentarios</p>
                    )}
                    {comments.map((comment) => (
                        <div key={comment.id} className="post-detail-comment">
                            <div className="post-detail-comment-info">
                                <div className="post-detail-info-user">
                                    <ProfileIcon
                                        key={comment.user}
                                        name={comment.username}
                                        onClick={comment.user}
                                        showScore="False"
                                        userId={comment.user}
                                    />
                                </div>
                                <p className="post-detail-comment-description">{comment.content}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}