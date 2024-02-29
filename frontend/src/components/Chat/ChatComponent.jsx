import React, { useState, useEffect } from 'react';
import './ChatComponent.css'

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
    const username = localStorage.getItem('username');
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
      body: JSON.stringify({ content, username }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log("FETCHING");
      // Llama a fetchMessages solo después de que la respuesta ha sido procesada.
      fetchMessages();
    })
    .catch(error => console.error('Error:', error));

    
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
        {/* {messages.map((msg, index) => (
          <p key={index}><strong>{msg.author__username}:</strong> {msg.content}</p>
        ))} */}
        <ul>
        {messages.map((message, index) => (
          <li key={index} className={message.author__username === localStorage.getItem('username') ? 'my-message' : 'other-message'}>
            <div className="message-author"><strong>{message.author__username}</strong></div>
            <div className="message-text">{message.content}</div>
          </li>
        ))}
      </ul>
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
