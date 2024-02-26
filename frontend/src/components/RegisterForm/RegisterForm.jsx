import React from 'react';
import './RegisterForm.css';
import Text, { TEXT_TYPES } from '../Text/Text';

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
      <div className='register-container'>
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Registrarse' />
        <div className='form-container'>
          <form className='form' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor='username'>Nombre de usuario:</label>
              <input type='text' id='username' name='username' className='form-input' value={this.state.username} onChange={this.handleChange} required />
              {errors.username && <p className="error-message">{errors.username[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email:</label>
              <input type='email' id='email' name='email' className='form-input' value={this.state.email} onChange={this.handleChange} required />
              {errors.email && <p className="error-message">{errors.email[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Contraseña:</label>
              <input type='password' id='password' name='password' className='form-input' value={this.state.password} onChange={this.handleChange} required />
              {errors.password && <p className="error-message">{errors.password[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='first_name'>Nombre:</label>
              <input type='text' id='first_name' name='first_name' className='form-input' value={this.state.first_name} onChange={this.handleChange} required />
              {errors.first_name && <p className="error-message">{errors.first_name[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='last_name'>Apellidos:</label>
              <input type='text' id='last_name' name='last_name' className='form-input' value={this.state.last_name} onChange={this.handleChange} required />
              {errors.last_name && <p className="error-message">{errors.last_name[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='address'>Dirección:</label>
              <input type='text' id='address' name='address' className='form-input' value={this.state.address} onChange={this.handleChange} required />
              {errors.address && <p className="error-message">{errors.address[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='postal_code'>Código postal:</label>
              <input type='text' id='postal_code' name='postal_code' className='form-input' value={this.state.postal_code} onChange={this.handleChange} required />
              {errors.postal_code && <p className="error-message">{errors.postal_code[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='city'>Ciudad:</label>
              <input type='text' id='city' name='city' className='form-input' value={this.state.city} onChange={this.handleChange} required />
              {errors.city && <p className="error-message">{errors.city[0]}</p>}
            </div>
            <div className='form-group'>
              <label htmlFor='is_designer'>
                <input type='checkbox' id='is_designer' name='is_designer' checked={this.state.is_designer} onChange={this.handleChange} />
                ¿Eres diseñador?
              </label>
            </div>
            <div className='form-group'>
              <label htmlFor='is_printer'>
                <input type='checkbox' id='is_printer' name='is_printer' checked={this.state.is_printer} onChange={this.handleChange} />
                ¿Eres impresor?
              </label>
            </div>
            <button className='large-btn button' type='submit'>Registrarse</button>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
