import React from 'react';
import { useParams } from 'react-router-dom';
import ChatComponent from '../components/Chat/ChatComponent';

export const ChatPage = () => {
  const { roomId } = useParams(); // Obtiene roomId de la URL

  return <ChatComponent roomId={roomId} />;
};


