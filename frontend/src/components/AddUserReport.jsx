import React, { Component, useState } from "react";
import Button, { BUTTON_TYPES } from "./Button/Button";
import "./AddUserReport.css";
import info from '../assets/bx-info-circle.svg';


// Modal Component
class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <a onClick={this.props.onClose} className="close">&times;</a>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class AddUserReport extends Component {
  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      isAuthenticated: localStorage.getItem("token") ? true : false,
      product: null,
      title: "",
      description: "",
      reason: "P",
      errors: {},
      showForm: false,
      file: null,
    };

    this.handleFileChange = this.handleFileChange.bind(this);
  }

  validateForm() {
    const { title, description, reason, file } = this.state;
    const errors = {};

    if (!title.trim()) {
      errors.title = "El asunto es obligatorio.";
    }

    if (!description.trim()) {
      errors.description = "Los motivos son obligatorios.";
    }

    if (title.trim().length < 5 || title.length > 20) {
      errors.title = "El asunto debe tener entre 5 y 20 caracteres.";
    }

    if (description.trim().length < 10 || description.length > 250) {
      errors.description =
        "Los motivos deben tener entre 10 y 250 caracteres.";
    }

    if (!reason) {
      errors.reason = "Debes seleccionar una razón.";
    }

    if (!file) {
      errors.file = 'La comprobación es obligatoria.';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  openModal() {
    this.setState({ showForm: true });
    if (!this.state.isAuthenticated) {
      this.setState({
        errors: { login: "Debes iniciar sesión para reportar al usuario." },
      });
    }
  }

  closeModal() {
    this.setState({ showForm: false });
  }
  toggleForm = () => {
    if (this.state.isAuthenticated) {
      this.setState((prevState) => ({ showForm: !prevState.showForm }));
    } else {
      this.setState({
        errors: { login: "Debes iniciar sesión para reportar al usuario." },
      });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    // Send report to the backend

    if (this.validateForm()) {
      const formData = new FormData();
      formData.append('file', this.state.file);
      formData.append('title', this.state.title);
      formData.append('description', this.state.description);
      formData.append('reason', this.state.reason);
      formData.append('product', null);
      formData.append('user', this.props.user.id);

      const backend = import.meta.env.VITE_APP_BACKEND;
      let petition1 = `${backend}/report/add-report-user`;
      petition1 = petition1.replace(/"/g, '')
      fetch(petition1, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData
      })
        .then(response => {
          if (response.status === 400) {
            response.json().then(data => {
              console.log("Error 400: " + data.error);
              this.setState({ errors: { unique: data.error } });
              this.setState({ showForm: true });
            });
          } else if (response.ok) {
            this.setState({ showForm: false });
            alert("Reporte enviado correctamente." );
          } else {
            console.error("Error submitting report");
          }
        })
        .catch(error => {
          console.error('Error al enviar el formulario:', error);
          alert('Error al enviar el formulario.');
        });
        
        fetch();
        this.setState({ showForm: false });

    } else {
      return;
    }
  };

  handleReasonsChange = (e) => {
    this.setState({ reason: e.target.value });
  };
  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleFileChange(event) {
    const selectedFile = event.target.files[0];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = selectedFile ? selectedFile.name.split('.').pop().toLowerCase() : null;

    if (!selectedFile) {
      this.setState({ file: null });
      return;
    }

    if (!allowedExtensions.includes(fileExtension)) {
      this.setState({ file: null, errors: { file: 'Por favor, seleccione un archivo de imagen válido (.jpg, .jpeg, .png).' } });
      return;
    }

    this.setState({ file: selectedFile });

  }

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };
  render() {
    const { isAuthenticated, errors, showForm } = this.state;

    return (
      <div className="report-user-container">

        <div className="report-button-container">
          <button className="report-btn button" onClick={showForm && isAuthenticated ? this.closeModal : this.openModal}>
            <img src={info} alt="Reportar usuario" className="report-icon"/>
            {showForm && isAuthenticated ? "Reporte" : "Reportar usuario"}
          </button>
        </div>
        
        {errors.login && (
          <div className="opinion-login-error">
            <p className="opinion-error-text">{errors.login}</p>
            <Button
              type={BUTTON_TYPES.LARGE}
              text="Iniciar sesión"
              path="/login"
            />
          </div>
        )}

        {showForm && isAuthenticated && (
          <Modal show={showForm} onClose={this.closeModal}>

            <div className="report-form-contents">

              <div className="form-title">
                <h3 className="modal-title">Reportar usuario</h3>
              </div>

              <form className="form-inputs-section">

                <div className="form-input-container">
                  <label htmlFor="title" className="form-input-label">Asunto</label>
                  <input type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} className="form-input" />
                  {this.state.errors.title && (
                    <p className="error">{this.state.errors.title}</p>
                  )}
                </div>

                <div className="form-input-container">
                  <label htmlFor="description" className="form-input-label">Motivos detallados</label>
                  <div className="textarea-container">
                    <textarea type="text" name="description" value={this.state.description} onChange={this.handleDescriptionChange} className="form-input" />
                  </div>
                  {this.state.errors.description && (
                    <p className="error">{this.state.errors.description}</p>
                  )}
                </div>

                <div className='form-input-container'>
                  <p className="form-input-label">Comprobación</p>
                  {this.state.file && <p className="file-name"><strong>Archivo seleccionado: </strong>{this.state.file.name}</p>}
                  <label htmlFor="file"
                          className={this.state.file ? "upload-file-button loaded" : "upload-file-button"}>{this.state.file ? "Cambiar archivo" : "Seleccionar archivo"}</label>
                  <input type='file' id='file' name='file' className='form-input upload' accept='.jpg, .jpeg, .png' onChange={this.handleFileChange}/>
                  {errors.file && <div className="error">{errors.file}</div>}
                </div>
                
                <div className="form-input-container">
                  <label htmlFor="reason" className="form-input-label">Motivo del reporte</label>
                  <select name="reason" value={this.state.reason} onChange={this.handleReasonsChange} className="form-selector">
                    <option value="P">Problema de calidad</option>
                    <option value="D">Derechos de autor</option>
                    <option value="S">Spam o publicidad</option>
                    <option value="F">Fraude o estafa</option>
                    <option value="R">Robo de diseño/idea</option>
                    <option value="I">Inapropiado</option>
                  </select>
                  {this.state.errors.reason && (
                    <p className="error">{this.state.errors.reason}</p>
                  )}
                </div>
                
              </form>

            </div>
            
            
            {this.state.errors.unique && (
              <p className="error">{this.state.errors.unique}</p>
            )}
            <div className="report-user-form-group-button">
              <Button
                type={BUTTON_TYPES.LARGE}
                text="Publicar"
                onClick={this.handleSubmit}
              />
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
export default AddUserReport;
