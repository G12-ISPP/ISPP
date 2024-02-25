import React from 'react';
import ChatComponent from '../components/ChatComponent.jsx';

export const ChatPage = () => {
  // Puedes pasar dinámicamente el nombre de la sala de chat o cualquier otra prop necesaria
  return <ChatComponent roomName="1" />;
};

export default ChatPage;
