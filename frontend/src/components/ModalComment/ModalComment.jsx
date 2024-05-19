import React, { useState } from 'react';
import './ModalComment.css';
import PropTypes from 'prop-types';

const ModalComment = ({postId, setWantComment, addComment}) => {
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const backend = import.meta.env.VITE_APP_BACKEND;

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            setErrors({ comment: 'El comentario no puede estar vacío' });
            return;
        }
        try {
            const formData = new FormData();
            formData.append('comment', comment.trim());
            formData.append('post_id', postId);
            formData.append('user_id', localStorage.getItem('userId'));
            
            let petition = backend + '/comment/add_comment/';
            petition = petition.replace(/"/g, '');

            if (comment.length > 100) {
                setErrors({ comment: 'El comentario no puede tener más de 100 caracteres' });
                return;
            }
        
            const response = await fetch(petition, {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              body: formData,
            });
        
            if (response.ok) {
                setWantComment(false);
                alert('Comentario enviado correctamente');
                addComment({comment, username: localStorage.getItem('userId')})
            } else if (response.status === 400 || response.status === 404) {
                const errorData = await response.json();
                setErrors({ comment: errorData.error });
            }
            else if (response.status === 401) {
                setErrors({ comment: 'Debes iniciar sesión para comentar' });
            }else if (response.status === 403) {
                setErrors({ comment: 'Ya has comentado en este post' });
            }
            else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
          } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            setErrors({ comment: 'Error al enviar el comentario' });
          }
        
    };

    const closeModal = () => {
        setWantComment(false);
    }

    return (
        <div className="modal-comment">
            <div className="modal-comment-content">
                <div className="close" onClick={closeModal}>
                        X
                </div>
                <h2>Añadir comentario</h2>
                <form className='modal-comment-form' onSubmit={handleSubmit}>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={handleCommentChange}
                    ></textarea>
                    {errors.comment && <div className="error">{errors.comment}</div>}
                    <button type="submit" className="button">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default ModalComment;

ModalComment.propTypes = { 
    setWantComment: PropTypes.func.isRequired,
    postId: PropTypes.number.isRequired,
}