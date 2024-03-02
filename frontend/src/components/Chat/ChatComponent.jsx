import React, { useRef, useState, useEffect } from 'react';
import './ChatComponent.css'
import 'react-chat-elements/dist/main.css';
import { MessageBox } from 'react-chat-elements'
import { useNavigate } from 'react-router-dom';



const ChatComponent = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const backend = import.meta.env.VITE_APP_BACKEND;
  let navigate = useNavigate();
  const endOfMessagesRef = useRef(null);
  const messagesContainerRef = useRef(null);


  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
 
  // Función para cargar los mensajes de la sala de chat
  const fetchMessages = () => {
    const token = localStorage.getItem('token'); 
    return fetch(`${backend}/chat/${roomId}/messages/`, {
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
      setNewMessage('');
      console.log("FETCHING");
      setTimeout(fetchMessages, 200); 
      setTimeout(() => {
        scrollToBottom();
      }, 250); // Ajusta este tiempo si es necesario
    })
    .catch(error => {
      console.error('Error:', error);
      setNewMessage('');
    })
    
  }

  useEffect(() => {
    fetchMessages().then(() => {
      setTimeout(() => {
        scrollToBottom();
      }, 250); // Ajusta este tiempo si es necesario
    });
    // Establece un intervalo para actualizar mensajes, si es necesario, pero sin hacer scroll
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [roomId]); 
  
  return (
    <div>
       <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="left-arrow">←</i> Volver
        </button>
      </div>
      <div className='window' ref={messagesContainerRef}>
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
    </div>
  );
};

export default ChatComponent;
