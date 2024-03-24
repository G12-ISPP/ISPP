import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatComponent from '../components/Chat/ChatComponent';
import PageTitle from '../components/PageTitle/PageTitle';

export const ChatPage = () => {
  const { roomId } = useParams(); // Obtiene roomId de la URL
  const [roomName, setRoomName] = useState(''); // Estado para almacenar el nombre de la sala de chat
  const [roomMate, setRoomMate] = useState(''); 
  const token = localStorage.getItem('token'); // Obtiene el token almacenado en localStorage
  const currentUser = localStorage.getItem('username'); 
  const backend = import.meta.env.VITE_APP_BACKEND;
  


  useEffect(() => {
    if(!token){
      alert("Debes estar logueado para acceder a los chats.");
      return window.location.href=`/login`;
    }
    // Construye la URL con el roomId
    const url = `${backend}/chat/chatroom/${roomId}`;
    if(roomId>0){
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Asume que el esquema de autorización es Bearer
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Procesa la respuesta si el status code indica éxito
        }
        throw new Error(`Error en la petición: ${response.status}`); // Lanza un error si el status code indica un fallo
      })
      .then(data => {
        if (data && data.members) {
          const otherUsernames = data.members
            .filter(member => member.username !== currentUser) // Filtra para excluir el usuario actual
            .map(member => member.username); // Extrae los nombres de usuario
        
          console.log(otherUsernames); // Haz lo que necesites con este array
          setRoomName('Chat con: ' + otherUsernames[0]);
          setRoomMate(otherUsernames[0]);
        }      
         // Actualiza el estado con el nombre de la sala
      })
      .catch(error => {
        roomId  > 0 ? console.error('Hubo un problema con la petición fetch:', error) : console.log('Entrando en página principal del chat'); // Maneja errores en la petición o en la respuesta
      });
    }
    // Realiza la petición fetch dentro de useEffect
    
  }, [roomId, token]); // Dependencias del efecto: roomId y token

  // Pasa roomId y roomName obtenidos al ChatComponent

  return token? <ChatComponent roomId={roomId || 0} roomName={roomName} roomMate={roomMate}  /> : null;

};
