import React from 'react';
import './DeleteConfirmationModal.css'; // Importa tu archivo de estilos CSS para el modal

const DeleteConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="delete-confirmation-modal">
      <div className="modal-content">
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
        <div className="buttons-container">
          <button className="cancel-button" onClick={onCancel}>Cancelar</button>
          <button className="confirm-button" onClick={onConfirm}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
