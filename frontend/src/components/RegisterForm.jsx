import React from 'react';

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
      const response = await fetch('http://127.0.0.1:8000/users/register/', {
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
      <div className='register-form'>
        <h2>User Registration</h2>
        {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>} 
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username:</label>
            <input type='text' id='username' name='username' value={this.state.username} onChange={this.handleChange} required />
            {errors.username && <p className="error-message">{errors.username[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input type='email' id='email' name='email' value={this.state.email} onChange={this.handleChange} required />
            {errors.email && <p className="error-message">{errors.email[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password' name='password' value={this.state.password} onChange={this.handleChange} required />
            {errors.password && <p className="error-message">{errors.password[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='first_name'>First Name:</label>
            <input type='text' id='first_name' name='first_name' value={this.state.first_name} onChange={this.handleChange} required />
            {errors.first_name && <p className="error-message">{errors.first_name[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='last_name'>Last Name:</label>
            <input type='text' id='last_name' name='last_name' value={this.state.last_name} onChange={this.handleChange} required />
            {errors.last_name && <p className="error-message">{errors.last_name[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='address'>Address:</label>
            <input type='text' id='address' name='address' value={this.state.address} onChange={this.handleChange} required />
            {errors.address && <p className="error-message">{errors.address[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='postal_code'>Postal Code:</label>
            <input type='text' id='postal_code' name='postal_code' value={this.state.postal_code} onChange={this.handleChange} required />
            {errors.postal_code && <p className="error-message">{errors.postal_code[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='city'>City:</label>
            <input type='text' id='city' name='city' value={this.state.city} onChange={this.handleChange} required />
            {errors.city && <p className="error-message">{errors.city[0]}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='is_designer'>
              <input type='checkbox' id='is_designer' name='is_designer' checked={this.state.is_designer} onChange={this.handleChange} />
              Are you a designer?
            </label>
          </div>
          <div className='form-group'>
            <label htmlFor='is_printer'>
              <input type='checkbox' id='is_printer' name='is_printer' checked={this.state.is_printer} onChange={this.handleChange} />
              Are you a printer?
            </label>
          </div>
          <button type='submit'>Register</button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
