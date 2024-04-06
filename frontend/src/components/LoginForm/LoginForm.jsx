import './LoginForm.css';

import {useState, useEffect, useContext} from 'react';
import Button, { BUTTON_TYPES } from '../Button/Button';
import logo from '../../assets/logo.png';
import arrow from '../../assets/bx-left-arrow-alt.svg';
import AuthContext from "../../context/AuthContext.jsx";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { loginUser } = useContext(AuthContext)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);

  const onButtonClick = (path) => {
		window.location.href = path;
	};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isUserLoggedIn) {
      setErrorMessage('Ya has iniciado sesión con un usuario, debes cerrar sesión antes.');
      return;
    }

    try {
      let petition = backend + '/users/login/';
      petition = petition.replace(/"/g, '')
      const response = await fetch(petition, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.access);
        console.log(data.refresh);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('userId', data.userId);
        loginUser(data.token, data.refresh);
        window.location.href = "/";
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'El usuario o contraseña introducido no es válido.');
      }
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      setErrorMessage('Error de conexión con el servidor');
    }
  }

  return (
    <div className='login'>
      <div className="brand-container-login">
        <div className="back-button-login" onClick={() => onButtonClick('/')}>
          <img src={arrow} className="arrow-login" />
          <p className="back-login">Volver</p>
        </div>
        <img src={logo} className="logo-login" onClick={() => onButtonClick('/')} />
        <div className="slogans-login">
          <p className="slogan-text-login">¡Bienvenido!</p>
          <p className="slogan-text-login">Explora la innovación en 3D.</p>
          <p className="slogan-text-login">Únete a nuestra comunidad.</p>
        </div>
      </div>
      <div className="login-form-container">
        <div className='login-data-container'>
          <p className="login-form-title">Iniciar sesión</p>
          <p className="login-form-subtitle">¿No tienes cuenta? <span className="register-link" onClick={() => onButtonClick('/register')}>Regístrate</span></p>
          <form className='login-form' onSubmit={handleSubmit}>
            <div className='login-form-group'>
              <input type='text' id='username' name='username' className='form-input' placeholder='Nombre de usuario' value={formData.username} onChange={handleChange} required />
            </div>
            <div className='login-form-group'>
              <input type='password' id='password' name='password' className='form-input' placeholder='Contraseña' value={formData.password} onChange={handleChange} required />
            </div>
            {errorMessage && <p className="login-error-message">{errorMessage}</p>}
            <Button type={BUTTON_TYPES.AUTHENTICATION} text='Iniciar sesión' action='submit' />
          </form>
        </div>
      </div>
      </div>
      
  );
}

export default LoginForm;
