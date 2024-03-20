import React from 'react';
import './RegisterForm.css';
import Button, { BUTTON_TYPES } from '../Button/Button';
import Modal from '../Modal/Modal';
import logo from '../../assets/logo.png';
import arrow from '../../assets/bx-left-arrow-alt.svg';
import avatar from '../../assets/avatar.svg';
import editIcon from '../../assets/bxs-edit.svg';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: avatar,
      preview: null,
      modal: false,
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      address: '',
      postal_code: '',
      city: '',
      is_designer: false,
      is_printer: false,
      customerAgreementChecked: false,
      showPassword: false,
      errors: {}
    };
  }

  onButtonClick = (path) => {
		window.location.href = path;
	};

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState({
      [name]: type === 'checkbox' ? checked : value,
      customerAgreementChecked: name === 'customerAgreementChecked' ? checked : this.state.customerAgreementChecked
    });
  }

  setImage = (preview) => {
    this.setState({ preview });
  }

  onClick = () => {
    this.setState({ modal: true });
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si el checkbox de acuerdo del cliente está marcado
    if (!this.state.customerAgreementChecked) {
      this.setState({
        errors: { customerAgreement: 'Debe aceptar el acuerdo del cliente' }
      });
      return; // Detener el envío del formulario si el checkbox no está marcado
    }

    try {
      const base64Response = await fetch(this.state.preview);
      const blob = await base64Response.blob();

      const formData = new FormData();
      formData.append('username', this.state.username);
      formData.append('email', this.state.email);
      formData.append('password', this.state.password);
      formData.append('first_name', this.state.first_name);
      formData.append('last_name', this.state.last_name);
      formData.append('address', this.state.address);
      formData.append('postal_code', this.state.postal_code);
      formData.append('city', this.state.city);
      formData.append('is_designer', this.state.is_designer);
      formData.append('is_printer', this.state.is_printer);
      formData.append('is_active', true);
      if(this.state.preview !== null){
        formData.append('profile_picture', blob, `profile_picture_${this.state.username}.png`);
      }
  
      const id = window.location.href.split('/')[4];
      let petition = backend + '/users/register/';
      petition = petition.replace(/"/g, '');
  
      const response = await fetch(petition, {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        alert('Registro exitoso');
        window.location.href = "/";
      } else {
        const data = await response.json();
        if (data.error) {
          this.setState({ errorMessage: data.error });
        } else {
          this.setState({ errors: data });
        }
      }
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      this.setState({ errorMessage: 'Error de conexión con el servidor' });
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className='register'>
        <div className="brand-container-register">
          <div className="back-button-register" onClick={() => this.onButtonClick('/')}>
            <img src={arrow} className="arrow-register" />
            <p className="back-register">Volver</p>
          </div>
          <img src={logo} className="logo-register" onClick={() => this.onButtonClick('/')} />
          <div className="slogans-register">
            <p className="slogan-text-register">¡Bienvenido!</p>
            <p className="slogan-text-register">Explora la innovación en 3D.</p>
            <p className="slogan-text-register">Únete a nuestra comunidad.</p>
          </div>
        </div>
        <div className='register-form-container'>
          <div className="register-data-container">
            <p className="register-form-title">Crear una cuenta</p>
            <p className="register-form-subtitle">¿Ya tienes una cuenta? <span className="login-link" onClick={() => this.onButtonClick('/login')}>Inicia sesión</span></p>
            <form className='register-form' onSubmit={this.handleSubmit}>
              <div className='register-group'>
                <img className='avatar' src={this.state.preview !== null ? this.state.preview : this.state.avatar} onClick={this.onClick} />
                <img className='edit-icon' src={editIcon} onClick={this.onClick} />
                {this.state.modal && (<Modal modal={this.state.modal} toggle={() => this.setState({modal: false})} setImage={this.setImage}/>)}
              </div>
              <div className='register-form-group'>
                <input type='text' id='username' name='username' className='form-input' placeholder='Nombre de usuario' value={this.state.username} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='email' id='email' name='email' className='form-input' placeholder='Correo electrónico' value={this.state.email} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
              
              <input
                type={this.state.showPassword ? 'text' : 'password'} // Mostrar contraseña si showPassword es true
                id='password'
                name='password'
                className='form-input'
                placeholder='Contraseña'
                value={this.state.password}
                onChange={this.handleChange}
                required/>
                <a type="button" onClick={this.togglePasswordVisibility}>
                  {this.state.showPassword ? <FontAwesomeIcon icon={faEye} />  : <FontAwesomeIcon icon={faEyeSlash} />}
                </a>
              </div>
              <div className='register-form-row'>
                <div className='register-form-group left'>
                  <input type='text' id='first_name' name='first_name' className='form-input' placeholder='Nombre' value={this.state.first_name} onChange={this.handleChange} required />
                </div>
                <div className='register-form-group right'>
                  <input type='text' id='last_name' name='last_name' className='form-input' placeholder='Apellidos' value={this.state.last_name} onChange={this.handleChange} required />
                </div>
              </div>
              <div className='register-form-group'>
                <input type='text' id='address' name='address' className='form-input' placeholder='Dirección' value={this.state.address} onChange={this.handleChange} required />
              </div>
              <div className='register-form-row'>
                <div className='register-form-group left'>
                  <input type='text' id='postal_code' name='postal_code' className='form-input' placeholder='Código postal' value={this.state.postal_code} onChange={this.handleChange} required />
                </div>
                <div className='register-form-group right'>
                  <input type='text' id='city' name='city' className='form-input' placeholder='Ciudad' value={this.state.city} onChange={this.handleChange} required />
                </div>
              </div>
              <div className="role-selector">
                <label htmlFor='is_designer' className='register-checkbox-label'>
                  <input type='checkbox' id='is_designer' name='is_designer' checked={this.state.is_designer} onChange={this.handleChange} />
                  ¿Eres diseñador?
                </label>
                <label htmlFor='is_printer' className='register-checkbox-label'>
                  <input type='checkbox' id='is_printer' name='is_printer' checked={this.state.is_printer} onChange={this.handleChange} />
                  ¿Eres impresor?
                </label>
              </div>
                <label htmlFor='customerAgreement' className='register-checkbox-label'>
                  <input type='checkbox' id='customerAgreement' name='customerAgreementChecked' checked={this.state.customerAgreementChecked} onChange={this.handleChange} />
                  Acepto los términos y condiciones descritos <a href="/terminos">aquí</a>
                </label>
              <div className="error-messages-container">
                {errors.username && <p className="register-error-message">{'Nombre de usuario: ' + errors.username[0]}</p>}
                {errors.email && <p className="register-error-message">{'Email: ' + errors.email[0]}</p>}
                {errors.password && <p className="register-error-message">{'Contraseña: ' + errors.password[0]}</p>}
                {errors.first_name && <p className="register-error-message">{'Nombre: ' + errors.first_name[0]}</p>}
                {errors.last_name && <p className="register-error-message">{'Apellidos: ' + errors.last_name[0]}</p>}
                {errors.address && <p className="register-error-message">{'Dirección: ' + errors.address[0]}</p>}
                {errors.postal_code && <p className="register-error-message">{'Código postal: ' + errors.postal_code[0]}</p>}
                {errors.city && <p className="register-error-message">{'Ciudad: ' + errors.city[0]}</p>}
                {errors.customerAgreement && <p className="register-error-message">{errors.customerAgreement}</p>}
              </div>
              <Button type={BUTTON_TYPES.AUTHENTICATION} text='Registrarse' action='submit' />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;

RegisterForm.propTypes = {
  modal: PropTypes.bool,
  toggle: PropTypes.func,
};

