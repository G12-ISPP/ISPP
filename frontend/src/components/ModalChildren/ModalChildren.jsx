import React from 'react';
import PropTypes from "prop-types";

export const ModalChildren = ({ isOpen, onClose, children }) => {
    const handleModalClick = (e) => {
        // Evita que el clic en el contenido del modal se propague al contenedor principal
        e.stopPropagation();
    };

    const handleBackgroundClick = () => {
        // Cierra el modal cuando se hace clic en el fondo fuera del contenido del modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal" onClick={handleBackgroundClick}>
            <div className="modal-content" onClick={handleModalClick}>
                {children}
                <button className="close-modal" onClick={onClose}>x</button>
            </div>
        </div>
    );
};

ModalChildren.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node
};
