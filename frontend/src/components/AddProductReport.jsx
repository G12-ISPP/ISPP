import React, { Component, useState } from "react";
import Button, { BUTTON_TYPES } from "./Button/Button";
// Modal Component
class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal">
        <div className="modal-content">
          {this.props.children}
          <Button
            type={BUTTON_TYPES.REPORT}
            text="Cancelar"
            onClick={this.props.onClose}
          />
        </div>
      </div>
    );
  }
}

class AddProductReport extends Component {
  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      isAuthenticated: localStorage.getItem("token") ? true : false,
      product: null,
      errors: {},
      showForm: false,
    };
  }

  openModal() {
    this.setState({ showForm: true });
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

  render() {
    const { isAuthenticated, errors, showForm } = this.state;
    console.log(showForm);

    return (
      <>
        <Button
          type={BUTTON_TYPES.REPORT}
          text={showForm ? "Ocultar formulario" : "Reportar producto"}
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
            <h2>Form Title</h2>
            <form>
              <label>
                Name:
                <input type="text" name="title" />
              </label>
              <br></br>
              <label>
                Descripción:
                <input type="text" name="description" />
              </label>
              <br></br>
              <label>
                Selector:
                <select name="reason">
                  <option value="P">Problema de calidad</option>
                  <option value="D">Derecho de Autor</option>
                  <option value="S">Spam o publicidad</option>
                  <option value="F">Fraude o estafa</option>
                  <option value="R">Robo de diseño/idea</option>
                  <option value="I">Inapropiado</option>
                </select>
              </label>
              <br></br>
            </form>
            <Button
              type={BUTTON_TYPES.LARGE}
              text="Publicar Reporte"
              onClick={this.handleSubmit}
            />
          </Modal>
        )}
      </>
    );
  }
}
export default AddProductReport;
