import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import Button, { BUTTON_TYPES } from './Button/Button';
import Text, { TEXT_TYPES } from "./Text/Text";
import AddOpinion from './AddOpinion';
import Opinion from './Opinion';
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid';
import FollowButton from "./Follow/FollowBotton.jsx";
import PageTitle from './PageTitle/PageTitle';

const id = window.location.href.split('/')[4];

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const currentUserID = localStorage.getItem('userId');
  const [ownUser, setOwnUser] = useState(false);
  const [opinions, setOpinions] = useState([]);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_APP_BACKEND;

  useEffect(() => {

    const id = window.location.href.split('/')[4];
    const petition = `${backend}/users/api/v1/users/${id}/get_user_data/`;

    const fetchUserData = async () => {
      try {
        const response = await fetch(petition);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
        if (currentUserID === userData.id.toString()) {
          setOwnUser(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchOpinions = async () => {
      try {
        let petition = backend + '/opinion/api/v1/opinion/?target_user=' + id;
        petition = petition.replace(/"/g, '');
        const response = await fetch(petition, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOpinions(data);
        } else {
          console.error('Error al obtener las opiniones');
        }
      } catch (error) {
        console.error('Error al comunicarse con el backend:', error);
      }
    };

    fetchUserData();
    fetchOpinions();
  }, [id, currentUserID]);

  const handleChatClick = async () => {
    const otherUserID = user?.id;
    const petition = `${backend}/chat/chatroom/`;
    const token = localStorage.getItem('token');

    if(!token){
      alert("Debes estar logueado para acceder a los chats.");
      return window.location.href=`/login`;
    }

    try {
      const response = await fetch(petition, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserID, otherUserID })
      });

      if (!response.ok) {
        throw new Error('Failed to create or get chatroom');
      }
      const data = await response.json();
      navigate(`/chat/${data.chatroomID}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleProductListClick = async () => {
    try {
      navigate(`/user-details/${id}/products`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditClick = async () => {
    try {
      navigate(`/update-profile/` + id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {ownUser ? (
        <>
          <PageTitle title="Mi perfil" />
          <div className="section-title-container">
            <Text type={TEXT_TYPES.TITLE_BOLD} text='Mi perfil' />
          </div>
        </>
      ) : (
        <>
          <PageTitle title={user.username} />
          <div className="section-title-container">
            <Text type={TEXT_TYPES.TITLE_BOLD} text='Detalles de usuario' />
          </div>
        </>
      )}
      <div className="main">
        <div className="profile-summary">
          <div>
            <h2 className="title-detalle">{user.first_name} {user.last_name}</h2>
            {user.is_designer || user.is_printer ? (
              <div className="main-info-container">
                <div className="user-role-container">
                  <h3 className="user-role">{user.is_designer === true ? 'Diseñador ' : null}
                    {user.is_printer === true ? ' Impresor' : null}</h3>
                </div>
              </div>
            ) : null}
              <div className="user-img-container">
                <img className='img' src={user.image_url ? user.image_url : '/images/avatar.svg'} alt={user.username} />
              </div>
              <div className='description-container'>
                <p className='description'>{user.description}</p>
              </div>
            <h3 className="title-detalle">Contacto:</h3>
            <p>{user.email}</p>
            {ownUser ? (
              <div className="user-button">
                <Button type={BUTTON_TYPES.TRANSPARENT} text='Editar Perfil' onClick={handleEditClick} />
              </div>
            ) : (
              <div className="user-button">
                <Button type={BUTTON_TYPES.TRANSPARENT} text='Chat' onClick={handleChatClick} />
                {!localStorage.getItem('token') && <div className='error'>Debes iniciar sesión para poder acceder al chat con un usuario</div>}
              </div>
            )}
            <div className="user-button">
              <Button type={BUTTON_TYPES.TRANSPARENT} text='Productos' onClick={handleProductListClick} />
            </div>
            {ownUser || localStorage.getItem('token') === null ? null : (
              <div className="user-button">
                <FollowButton userId={id} />
              </div>
                )}
            <AddOpinion target_user={user.id} />
            {opinions.length > 0 ? (
              <>
                {opinions.map(opinion => (
                  <Opinion key={opinion.id} opinion={opinion} />
                ))}
              </>
            ) : (
              <div>Aún no hay opiniones para este usuario.</div>
            )}

            <div className="section-title-container">
              <Text type={TEXT_TYPES.TITLE_BOLD} text='Productos destacados' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={`?seller=${id}`} />
          </div>
        </div>
      </div>


    </>

  );
}

export default UserDetail;
