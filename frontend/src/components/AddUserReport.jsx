import React, { Component, useState } from "react";
import Button, { BUTTON_TYPES } from "./Button/Button";
import "./AddUserReport.css";
// Modal Component
class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <a onClick={this.props.onClose} class="close">&times;</a>
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
    };
  }

  validateForm() {
    const { title, description, reason } = this.state;
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
    if (!this.validateForm()) {
      return;
    }
    const formData = new FormData();

    const backend = import.meta.env.VITE_APP_BACKEND;
    const petition = `${backend}/report/add-report-user`;
    fetch(petition, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description,
        reason: this.state.reason,
        product: null,
        user: this.props.user.id,
        created_at: new Date().toISOString(),
      }),
    }).then((response) => {
      if (response.status === 401) {
        console.log("Error submitting report: Ya has reportado este usuario");
        this.setState({ errors: { unique: "Ya has reportado este usuario" } });
        this.setState({ showForm: true });
      } else if (response.ok) {
        console.log(response.json());
        this.setState({ showForm: false });
        alert("Reporte enviado correctamente");
      } else {
        console.error("Error submitting report");
      }
    });

    fetch();
    this.setState({ showForm: false });
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
  render() {
    const { isAuthenticated, errors, showForm } = this.state;

    return (
      <>
        <Button
          type={BUTTON_TYPES.REPORT}
          text={
            showForm && isAuthenticated
              ? "Reporte"
              : "Reportar usuario"
          }
          onClick={showForm && isAuthenticated
            ? this.closeModal
            : this.openModal}
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
            <h2>Reportar un usuario</h2>
            <form>
              <label>
                Titulo:
                <br></br>
                <input
                  type="text"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                  className="report-user-form-group-title"
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
                className="report-user-form-group-description"
                rows={5}
              />
              {this.state.errors.description && (
                <p className="error">{this.state.errors.description}</p>
              )}

              <br></br>
              <label>
                Motivo del Reporte:
                <br></br>
                <select
                  name="reason"
                  value={this.state.reason}
                  onChange={this.handleReasonsChange}
                  className="report-user-form-group-selector"
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
            <div className="report-user-form-group-button">
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
export default AddUserReport;
