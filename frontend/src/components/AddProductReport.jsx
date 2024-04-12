import React, { Component, useState } from "react";
import Button, { BUTTON_TYPES } from "./Button/Button";
import "./AddProductReport.css";
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

class AddProductReport extends Component {
  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.product = this.props.product;
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
      image_url: null,
    };

    this.handleFileChange = this.handleFileChange.bind(this);
  }

  validateForm() {
    const { title, description, reason, file } = this.state;
    const errors = {};

    if (!title.trim()) {
      errors.title = "El título es obligatorio";
    }

    if (!description.trim()) {
      errors.description = "La descripción es obligatoria";
    }

    if (title.trim().length < 5 || title.length > 20) {
      errors.title = "El título debe tener entre 5 y 20 caracteres";
    }

    if (description.trim().length < 10 || description.length > 250) {
      errors.description =
        "La descripción debe tener entre 10 y 250 caracteres";
    }

    if (!reason) {
      errors.reason = "Debes seleccionar una razón";
    }

    if (this.state.errors.unique) {
      errors.unique = "Ya has reportado este producto";
    }

    if (!file) {
      errors.file = 'La foto es obligatoria';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  openModal() {
    this.setState({ showForm: true });
    if (!this.state.isAuthenticated) {
      this.setState({
        errors: { login: "Debes iniciar sesión para reportar el producto." },
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
        errors: { login: "Debes iniciar sesión para reportar el producto." },
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
      formData.append('product', this.product.id);
      formData.append('user', null);

      const backend = import.meta.env.VITE_APP_BACKEND;
      let petition1 = `${backend}/report/add-report-product`;
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
            alert("Reporte enviado correctamente" );
          } else {
            console.error("Error submitting report");
          }
        })
        .catch(error => {
          console.error('Error al enviar el formulario:', error);
          alert('Error al enviar el formulario');
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

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
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
      this.setState({ file: null, errors: { file: 'Por favor, seleccione un archivo de imagen válido (.jpg, .jpeg, .png)' } });
      return;
    }

    this.setState({ file: selectedFile });

  }

  render() {
    const { isAuthenticated, errors, showForm } = this.state;

    return (
      <>
        <Button
          type={BUTTON_TYPES.REPORT}
          text={
            showForm && isAuthenticated
              ? "Ocultar formulario"
              : "Reportar producto"
          }
          onClick={this.openModal}
        />
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
            <h2>Reportar un producto</h2>
            <form>
              <label>
                Titulo:
                <br></br>
                <input
                  type="text"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                  className="report-product-form-group-title"
                />
                {this.state.errors.title && (
                  <p className="error">{this.state.errors.title}</p>
                )}
              </label>
              <br></br>
              <label>Descripción:</label>
              <br></br>
              <textarea
                type="text"
                name="description"
                onChange={this.handleDescriptionChange}
                value={this.state.description}
                className="report-product-form-group-description"
                rows={5}
              />
              {this.state.errors.description && (
                <p className="error">{this.state.errors.description}</p>
              )}
                            <label htmlFor='file' className='upload'>
                Comprobación
              </label>
              <div className='file-select'>
                <input type='file' id='file' name='file' className='form-input' accept='.jpg, .jpeg, .png' onChange={this.handleFileChange} />
                {errors.file && <div className="error">{errors.file}</div>}
              </div>
              

              <br></br>
              <label>
                Motivo del Reporte:
                <br></br>
                <select
                  name="reason"
                  value={this.state.reason}
                  onChange={this.handleReasonsChange}
                  className="report-product-form-group-selector"
                >
                  <option value="P">Problema de calidad</option>
                  <option value="D">Derecho de Autor</option>
                  <option value="S">Spam o publicidad</option>
                  <option value="F">Fraude o estafa</option>
                  <option value="R">Robo de diseño/idea</option>
                  <option value="I">Inapropiado</option>
                </select>
                {this.state.errors.reason && (
                  <p className="error">{this.state.errors.reason}</p>
                )}
              </label>
              <br></br>
            </form>
            {this.state.errors.unique && (
              <p className="error">{this.state.errors.unique}</p>
            )}
            <div className="report-product-form-group-button">
              <Button
                type={BUTTON_TYPES.LARGE}
                text="Publicar"
                onClick={this.handleSubmit} 
              />
            </div>
          </Modal>
        )}
      </>
    );
  }
}
export default AddProductReport;
