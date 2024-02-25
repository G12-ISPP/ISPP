import React, { useState, useEffect, useRef } from 'react';

export const ChatComponent = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const websocket = useRef(null);

  useEffect(() => {
    // Conectar al WebSocket cuando el componente se monta
    websocket.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

    websocket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.message) {
          // Asumiendo que data contiene 'message' y 'author'
          setMessages((prevMessages) => [...prevMessages, { text: data.message, author: data.author }]);
        }
      };
      

    websocket.current.onclose = (e) => {
      console.error('Chat socket closed unexpectedly');
    };

    // Limpiar al desmontar el componente
    return () => {
      websocket.current.close();
    };
  }, [roomName]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage && websocket.current) {
      websocket.current.send(JSON.stringify({
        'message': newMessage
      }));
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
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
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
