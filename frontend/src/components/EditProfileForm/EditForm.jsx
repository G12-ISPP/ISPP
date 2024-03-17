import React from 'react';
import './EditForm.css';
import Button, { BUTTON_TYPES } from '../Button/Button';
import Modal from '../Modal/Modal';
import avatar from '../../assets/avatar.svg';
import editIcon from '../../assets/bxs-edit.svg';
import PropTypes from 'prop-types';

const backend = import.meta.env.VITE_APP_BACKEND;

class EditProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: avatar,
      preview: null,
      modal: false,
      username: '',
      email: '',
      address: '',
      postal_code: '',
      city: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    let petition = `${backend}/designs/loguedUser`;
    petition = petition.replace(/"/g, '');

    try {
      const response = await fetch(petition, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
      });
      const userData = await response.json();
      this.setState({
        username: userData.username,
        email: userData.email,
        address: userData.address,
        postal_code: userData.postal_code,
        city: userData.city,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Manejar el error aquí, por ejemplo, mostrar un mensaje al usuario
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  setImage = (preview) => {
    this.setState({ preview });
  };

  onClick = () => {
    this.setState({ modal: true });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Realizar la solicitud de actualización del usuario aquí
      // Por ejemplo, usar fetch para enviar los datos actualizados al servidor
    } catch (error) {
      console.error('Error updating profile:', error);
      // Manejar el error aquí, por ejemplo, mostrar un mensaje al usuario
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <div className='edit-profile'>
        <div className='edit-profile-form-container'>
          <div className="edit-profile-data-container">
            <p className="edit-profile-form-title">Editar perfil</p>
            <form className='edit-profile-form' onSubmit={this.handleSubmit}>
              {/* <div className='edit-profile-group'>
                <img className='avatar' src={this.state.preview !== null ? this.state.preview : this.state.avatar} onClick={this.onClick} />
                <img className='edit-icon' src={editIcon} onClick={this.onClick} />
                {this.state.modal && (<Modal modal={this.state.modal} toggle={() => this.setState({modal: false})} setImage={this.setImage}/>)}
              </div> */}
              <div className='edit-profile-form-group'>
                <input type='text' id='username' name='username' className='form-input' placeholder='Nombre de usuario' value={this.state.username} onChange={this.handleChange} required />
              </div>
              <div className='edit-profile-form-group'>
                <input type='email' id='email' name='email' className='form-input' placeholder='Correo electrónico' value={this.state.email} onChange={this.handleChange} required />
              </div>
              <div className='edit-profile-form-group'>
                <input type='text' id='address' name='address' className='form-input' placeholder='Dirección' value={this.state.address} onChange={this.handleChange} required />
              </div>
              <div className='edit-profile-form-row'>
                <div className='edit-profile-form-group left'>
                  <input type='text' id='postal_code' name='postal_code' className='form-input' placeholder='Código postal' value={this.state.postal_code} onChange={this.handleChange} required />
                </div>
                <div className='edit-profile-form-group right'>
                  <input type='text' id='city' name='city' className='form-input' placeholder='Ciudad' value={this.state.city} onChange={this.handleChange} required />
                </div>
              </div>
              <div className="error-messages-container">
                {errors.username && <p className="edit-profile-error-message">{'Nombre de usuario: ' + errors.username[0]}</p>}
                {errors.email && <p className="edit-profile-error-message">{'Email: ' + errors.email[0]}</p>}
                {errors.address && <p className="edit-profile-error-message">{'Dirección: ' + errors.address[0]}</p>}
                {errors.postal_code && <p className="edit-profile-error-message">{'Código postal: ' + errors.postal_code[0]}</p>}
                {errors.city && <p className="edit-profile-error-message">{'Ciudad: ' + errors.city[0]}</p>}
              </div>
              <Button type={BUTTON_TYPES.AUTHENTICATION} text='Guardar cambios' action='submit' />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfileForm;

EditProfileForm.propTypes = {
  modal: PropTypes.bool,
  toggle: PropTypes.func,
};
