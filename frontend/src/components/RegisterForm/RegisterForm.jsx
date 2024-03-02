import React from 'react';
import './RegisterForm.css';
import Text, { TEXT_TYPES } from '../Text/Text';
import Button, { BUTTON_TYPES } from '../Button/Button';
import logo from '../../assets/logo.png';
import arrow from '../../assets/bx-left-arrow-alt.svg';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      errors: {}
    };
  }

  onButtonClick = (path) => {
		window.location.href = path;
	};

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState({
      [name]: type === 'checkbox' ? checked : value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const id = window.location.href.split('/')[4]
      let petition = backend + '/users/register/';
      petition = petition.replace(/"/g, '')
      const response = await fetch(petition, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
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
        <div className="brand-container">
          <div className="back-button" onClick={() => this.onButtonClick('/')}>
            <img src={arrow} className="arrow" />
            <p className="back">Volver</p>
          </div>
          <img src={logo} className="logo-register" onClick={() => this.onButtonClick('/')} />
          <div className="slogans">
            <p className="slogan-text">¡Bienvenido!</p>
            <p className="slogan-text">Explora la innovación en 3D.</p>
            <p className="slogan-text">Únete a nuestra comunidad.</p>
          </div>
        </div>
        <div className='register-form-container'>
          <div className="register-data-container">
            <p className="register-form-title">Crear una cuenta</p>
            <p className="register-form-subtitle">¿Ya tienes una cuenta? <span className="login-link" onClick={() => this.onButtonClick('/login')}>Inicia sesión</span></p>
            <form className='register-form' onSubmit={this.handleSubmit}>
              <div className='register-form-group'>
                <input type='text' id='username' name='username' className='form-input' placeholder='Nombre de usuario' value={this.state.username} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='email' id='email' name='email' className='form-input' placeholder='Correo electrónico' value={this.state.email} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='password' id='password' name='password' className='form-input' placeholder='Contraseña' value={this.state.password} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='text' id='first_name' name='first_name' className='form-input' placeholder='Nombre' value={this.state.first_name} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='text' id='last_name' name='last_name' className='form-input' placeholder='Apellidos' value={this.state.last_name} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='text' id='address' name='address' className='form-input' placeholder='Dirección' value={this.state.address} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='text' id='postal_code' name='postal_code' className='form-input' placeholder='Código postal' value={this.state.postal_code} onChange={this.handleChange} required />
              </div>
              <div className='register-form-group'>
                <input type='text' id='city' name='city' className='form-input' placeholder='Ciudad' value={this.state.city} onChange={this.handleChange} required />
              </div>
              <div className="role-selector">
                <label htmlFor='is_designer' className='checkbox-label'>
                  <input type='checkbox' id='is_designer' name='is_designer' checked={this.state.is_designer} onChange={this.handleChange} />
                  ¿Eres diseñador?
                </label>
                <label htmlFor='is_printer' className='checkbox-label'>
                  <input type='checkbox' id='is_printer' name='is_printer' checked={this.state.is_printer} onChange={this.handleChange} />
                  ¿Eres impresor?
                </label>
              </div>
              <div className="error-messages-container">
                {errors.username && <p className="register-error-message">{'Nombre de usuario: ' + errors.username[0]}</p>}
                {errors.email && <p className="register-error-message">{'Email: ' + errors.email[0]}</p>}
                {errors.password && <p className="register-error-message">{'Contraseña: ' + errors.password[0]}</p>}
                {errors.first_name && <p className="register-error-message">{'Nombre: ' + errors.first_name[0]}</p>}
                {errors.last_name && <p className="register-error-message">{'Apellidos: ' + errors.last_name[0]}</p>}
                {errors.address && <p className="register-error-message">{'Dirección: ' + errors.address[0]}</p>}
                {errors.postal_code && <p className="register-error-message">{'Código postal: ' + errors.postal_code[0]}</p>}
                {errors.city && <p className="register-error-message">{'Ciudad: ' + errors.city[0]}</p>}
              </div>
              <Button type={BUTTON_TYPES.LARGE} text='Registrarse' action='submit' />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
