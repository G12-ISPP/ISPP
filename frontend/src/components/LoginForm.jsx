import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/users/login/', {
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
        setErrorMessage(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      setErrorMessage('Error de conexión con el servidor');
    }
  }

  return (
    <div className='login-form'>
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' name='username' value={formData.username} onChange={handleChange} required />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
