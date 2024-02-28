import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const backend = import.meta.env.VITE_APP_BACKEND; // Asegúrate de ajustar esto según tu configuración
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChatClick = async () => {
    const currentUserID = localStorage.getItem('userId');
    const otherUserID = user?.id;
    const petition = `${import.meta.env.VITE_APP_BACKEND}/chat/chatroom/`;
    const token = localStorage.getItem('token');

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className='title'>Detalles de usuario</h1>

      {user.is_designer || user.is_printer ? (
        <div>
          <h2 className='title'>Rol de {user.first_name} {user.last_name}</h2>
          <div className="summary">
            <h3>{user.is_designer ? 'Diseñador ' : ''}{user.is_printer ? 'Impresor' : ''}</h3>
          </div>
        </div>
      ) : null}

      <div className="main">
        <img className='img' src='/images/avatar.svg' alt={user.username} />
        <div className="summary">
          <div>
            <h2 className="title-detalle">{user.first_name} {user.last_name}</h2>
            <h3 className="title-detalle">Localización:</h3>
            <p>{user.address}</p>
            <p>{user.city}</p>
            <p>{user.postal_code}</p>
            <h3 className="title-detalle">Contacto:</h3>
            <p>{user.email}</p>
          </div>
          <div className="chat">
            <button className="buy-button" onClick={handleChatClick}>Chat</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
