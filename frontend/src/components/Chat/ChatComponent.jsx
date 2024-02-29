import React, { useState, useEffect } from 'react';
import './ChatComponent.css'
import 'react-chat-elements/dist/main.css';
import { MessageBox } from 'react-chat-elements'



const ChatComponent = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const backend = import.meta.env.VITE_APP_BACKEND;
 
  // Función para cargar los mensajes de la sala de chat
  const fetchMessages = () => {
    const token = localStorage.getItem('token'); // Asume que el token está almacenado en localStorage
    fetch(`${backend}/chat/${roomId}/messages/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setMessages(data);
    })
    .catch(error => console.error('Error fetching messages:', error));
};

  // Función para enviar un nuevo mensaje
  const sendMessage = (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    const content = newMessage;
    fetch(`${backend}/chat/${roomId}/post_message/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Limpia el campo de entrada después de enviar el mensaje exitosamente
      setNewMessage('');
      console.log("FETCHING");
      // Asegúrate de llamar a fetchMessages para actualizar la lista de mensajes
      // Considera añadir un pequeño retraso aquí si los mensajes no se actualizan como se espera
      setTimeout(fetchMessages, 200); // Ajusta este tiempo según sea necesario
    })
    .catch(error => {
      console.error('Error:', error);
      // Considera también limpiar el mensaje en caso de error si es lo que deseas
      // setNewMessage('');
    });
  }

  // Cargar mensajes cuando el componente se monta y establecer intervalo para recargar mensajes
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000); // Ajustar según necesidades

    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar componente
  }, [roomId]);

  return (
    <div>
      <div className='window'>
        {
          messages.map((message, index) => (
            <MessageBox
              key={index}
              position={message.author__username === localStorage.getItem('username') ? 'right' : 'left'} // Ajusta la posición basada en si el mensaje fue enviado o recibido
              type="text"
              text={message.content}
              title={message.author__username}
              // Para más personalización, puedes añadir aquí otras props como `date`, `avatar`, etc.
            />
          ))
        }
      </div>
      <form className='f' onSubmit={sendMessage}>
        <input
          className='fi'
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className='fb' type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
