import React from 'react';
import ChatComponent from '../components/Chat/ChatComponent';


export const ChatPage = () => {
  // Asume que tienes el ID de la sala disponible. Aquí usamos '1' como ejemplo.
  // Asegúrate de que este valor sea el ID real que necesitas pasar.
  const roomId = 1; // Esto debería ser dinámico según tus necesidades

  // Ahora pasamos roomId como prop al ChatComponent
  return <ChatComponent roomId={roomId} />;
};

export default ChatPage;
