import React, { useState } from "react";
import Avatar from 'react-avatar-edit';
import "./Modal.css";
import PropTypes from "prop-types";

export default class Modal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

  onCrop = preview => {
    this.props.setImage(preview);
  }

  onClose = () => {
    this.props.setImage(null);
  }

  onBeforeFileLoad = (event) => {
    if(event.target.files[0].size > 71680){
      alert("El archivo es demasiado grande");
      event.target.value = "";
    };
  }

    render() {
      const modal = this.props;

        return (
            <>
            {modal && (
                <div className="modal">
                <div onClick={this.props.toggle} className="overlay"></div>
                <div className="modal-content">
                    <Avatar width={325} height={250} onCrop={this.onCrop} onClose={this.onClose} label="Elige una foto" labelStyle={{color: 'black', fontSize: '45px', cursor: 'pointer'}} />   
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