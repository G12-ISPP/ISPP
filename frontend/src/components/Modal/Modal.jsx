import React, {useState} from "react";
import Avatar from 'react-avatar-edit';
import "./Modal.css";
import PropTypes from "prop-types";

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onCrop = preview => {
        this.props.setImage(preview);
    }

    onClose = () => {
        this.props.setImage(null);
    }

    onBeforeFileLoad = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async function (event) {
            const image = new Image();
            image.onload = function () {
                const MAX_WIDTH = 800; // Ancho máximo deseado para la imagen optimizada
                const MAX_HEIGHT = 600; // Alto máximo deseado para la imagen optimizada
                let width = image.width;
                let height = image.height;

                // Redimensionar la imagen si es necesario
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, width, height);

                // Compresión de la imagen (puedes ajustar el valor 0.8 según tus necesidades)
                const webPDataUrl = canvas.toDataURL('image/webp', 0.8);

                // Enviar la imagen optimizada al servidor
                this.props.setImage(webPDataUrl);
            }.bind(this);

            image.src = event.target.result;
        }.bind(this);

        reader.readAsDataURL(file);
    }



    render() {
        const modal = this.props;

        return (
            <>
                {modal && (
                    <div className="modal">
                        <div onClick={this.props.toggle} className="overlay"></div>
                        <div className="modal-content">
                            <Avatar width={325} height={250} onCrop={this.onCrop} onClose={this.onClose}
                                    onBeforeFileLoad={this.onBeforeFileLoad} label="Elige una foto"
                                    labelStyle={{color: 'black', fontSize: '45px', cursor: 'pointer'}}/>
                            <button className="close-modal" onClick={this.props.toggle}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

Modal.propTypes = {
    modal: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    setImage: PropTypes.func.isRequired,
};