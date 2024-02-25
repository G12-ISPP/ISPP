import { useState, useEffect } from 'react';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);

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
        localStorage.setItem('token', data.token); // Almacena el token en el localStorage
        window.location.href = "/";
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'El usuario o contraseña introducido no es válido.');
      }
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      setErrorMessage('Error de conexión con el servidor');
    }
  }

  return (
    <div className='login-form'>
      <h2>Inicio de sesión</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Usuario:</label>
          <input type='text' id='username' name='username' value={formData.username} onChange={handleChange} required />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Contraseña:</label>
          <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
        </div>
        <button type='submit'>Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginForm;
