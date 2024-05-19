import React, { useEffect, useState } from 'react';
import { ChatList } from 'react-chat-elements';
import './ChatComponent.css'
import 'react-chat-elements/dist/main.css'; // Importar estilos de react-chat-elements
import { useNavigate } from 'react-router-dom';
import {getUser} from "../../api/users.api.jsx";


function UserChatList({ onUserClick }) {
  const [otherUser, setOtherUser] = useState({});
  const [users, setUsers] = useState([]);
  const backend = import.meta.env.VITE_APP_BACKEND;

  let navigate = useNavigate();

  const handleChatClick = async (otherUserID) => {
    const currentUserID = localStorage.getItem('userId');
    // Si otherUserID no se provee como parámetro o es undefined, puedes manejar ese caso aquí
    if (!otherUserID) {
      console.error('OtherUserID is required');
      return;
    }
    const petition = `${backend}/chat/chatroom/`;
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
    if(onUserClick) {
      onUserClick();
    }
  };

  const getLastMessage = async (otherUserID) => {
    const currentUserID = localStorage.getItem('userId');
    if (!otherUserID) {
      console.error('OtherUserID is required');
      return;
    }
    const petitionCreateChatroom = `${backend}/chat/chatroom/`; // Petición para crear/obtener chatroom
    const token = localStorage.getItem('token');
    let lastMessage = null;
  
    try {
      // Primera petición para obtener el chatroomId
      const responseChatroom = await fetch(petitionCreateChatroom, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserID, otherUserID })
      });
  
      if (!responseChatroom.ok) {
        throw new Error('Failed to create or get chatroom');
      }
      const dataChatroom = await responseChatroom.json();
      const chatroomId = dataChatroom.chatroomID;
  
      // Segunda petición utilizando chatroomId para obtener el último mensaje
      const petitionMessages = `${backend}/chat/${chatroomId}/messages`; // Ajusta esta URL según tu API
      const responseMessages = await fetch(petitionMessages, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (!responseMessages.ok) {
        throw new Error('Failed to get last message');
      }
      const messages = await responseMessages.json();
      lastMessage = messages.length > 0 ? messages[messages.length - 1] : 'Inicia una conversación'; // Ajusta esto según la estructura de respuesta de tu API
    } catch (error) {
      console.error('Error:', error);
    }
  
    return lastMessage;
  };

  useEffect(() => {
    const fetchUser = async (userId) => {
      const petition = `${backend}/users/api/v1/users/${userId}/get_user_data/`;
      try {
        const response = await fetch(petition);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setOtherUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUsersAndLastMessages = async () => {
      const token = localStorage.getItem('token');
      try {
        // Cargar usuarios
        const response = await fetch(`${backend}/chat/chat-users/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        const users = data.users;

        console.log("users")
        // Cargar el último mensaje para cada usuario
        const usersWithLastMessage = await Promise.all(users.map(async (user) => {
          const lastMessage = await getLastMessage(user.id);
          let response = await getUser(user.id);

          if (!response.ok) {
            alert('Error al obtener los datos del usuario');
          }

          user = await response.json();

          console.log(user)
          return {
            ...user,
            subtitle: lastMessage.content || "No hay mensajes",
            lastTime: lastMessage.timestamp// Asume que getLastMessage devuelve un mensaje o null
          };
        }));
  
        // Actualizar estado con los usuarios y sus últimos mensajes
        setUsers(usersWithLastMessage);
        for (let i = 0; i < usersWithLastMessage.length; i++) {
          console.log(usersWithLastMessage[i].image_url);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchUsersAndLastMessages();
  }, []); // Este efecto se ejecuta solo una vez al montar el componente
  


  

  return (

    <ChatList
      onClick={(chat) => handleChatClick(chat.userId)}
      className='user-list'
      dataSource={users.map(user => ({
        userId: user.id,
        avatar: user.image_url ? user.image_url : "/images/avatar.svg",
        title: user.username,
        subtitle: user.subtitle,
        date: user.lastTime, // Puedes ajustar esto según necesites, por ejemplo, la última vez que enviaron un mensaje
        unread: 2, // Aquí puedes agregar lógica para mostrar la cantidad de mensajes no leídos
      }))}
    />

  );
}

export default UserChatList;