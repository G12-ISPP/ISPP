import React, { useState, useEffect, useRef } from 'react';

export const ChatComponent = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const websocket = useRef(null);

  const fetchMessages = () => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (!token) {
      console.error("No hay token de autenticación disponible");
      return;
    }

    const url = `http://localhost:8000/chat/${roomId}/messages/`;
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`, // Incluir el token en el header Authorization
      }
    })
    .then(response => response.json())
    .then(data => {
      setMessages(data.messages.map(message => ({
        text: message.content,
        author: message.author__username // Asegúrate de que la respuesta incluya el username del autor
      })));
    })
    .catch(error => console.error('Error fetching messages:', error));
  };

  useEffect(() => {
    fetchMessages();

    // Asumiendo que tu WebSocket también requiere autenticación
    // y que puedes enviar el token como parte de la URL o de alguna otra manera.
    websocket.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/?token=${localStorage.getItem('token')}`);

    websocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prevMessages => [...prevMessages, { text: data.message, author: data.author }]);
    };

    websocket.current.onclose = (e) => {
      console.error('Chat socket closed unexpectedly');
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && websocket.current) {
      websocket.current.send(JSON.stringify({
        message: newMessage
      }));
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}><strong>{message.author}:</strong> {message.text}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
