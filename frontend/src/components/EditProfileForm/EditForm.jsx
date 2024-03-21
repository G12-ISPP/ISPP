import React from 'react';
import './EditForm.css';
import Button, { BUTTON_TYPES } from '../Button/Button';
import Modal from '../Modal/Modal';
import avatar from '../../assets/avatar.svg';
import editIcon from '../../assets/bxs-edit.svg';
import PropTypes from 'prop-types';
import PageTitle from '../PageTitle/PageTitle';
import Text, { TEXT_TYPES } from '../Text/Text';

const backend = import.meta.env.VITE_APP_BACKEND;
const frontend = import.meta.env.VITE_APP_FRONTEND;

const id = window.location.href.split('/')[4];

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
       errors: {},
       image_url: null,
     };
  }
 
  componentDidMount() {
    this.checkUserPermission();
  }

checkUserPermission = async () => {
    try {
        let petition = `${backend}/designs/loguedUser`;
        petition = petition.replace(/"/g, '');
        const response = await fetch(petition, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
          const userData = await response.json();
          const loggedInUserId = parseInt(userData.id, 10);
          const targetUserId = parseInt(id, 10);

          if (loggedInUserId !== targetUserId) {
              alert('No tienes permiso para editar este perfil.');
              window.location.href = '/';
              return;
          }
          this.fetchUserData();
        } else {
            alert('No tiene permiso para acceder a esta página.');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error al verificar los permisos del usuario:', error);
        alert('Error al verificar los permisos del usuario.');
        window.location.href = '/';
    }
};

 
  fetchUserData = async () => {
     let petition = `${backend}/users/api/v1/users/${id}/get_user_data/`;
     petition = petition.replace(/"/g, '');
 
     try {
       const response = await fetch(petition, {
         headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
       });
       const userData = await response.json();
       this.setState({
         id: userData.id,
         username: userData.username,
         email: userData.email,
         address: userData.address,
         postal_code: userData.postal_code,
         city: userData.city,
         image_url: userData.image_url ? userData.image_url : avatar,
         preview: userData.image_url ? userData.image_url : avatar,
       });
     } catch (error) {
       console.error('Error fetching user data:', error);
       alert('Error obteniendo los datos');
       window.location.href = '/';
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
    const base64Response = await fetch(this.state.preview);
    const blob = await base64Response.blob();
     const userId = this.state.id;
     const url = `${backend}/users/update-profile/${userId}/`;
 
     const formData = new FormData();
     formData.append('username', this.state.username);
     formData.append('email', this.state.email);
     formData.append('address', this.state.address);
     formData.append('postal_code', this.state.postal_code);
     formData.append('city', this.state.city);
 
     if(this.state.preview !== avatar){
      formData.append('profile_picture', blob, `profile_picture_${this.state.username}.png`);
      }
 
     const response = await fetch(url, {
       method: 'PATCH',
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
       },
       body: formData,
     });
 
     if (!response.ok) {
      const data = await response.json();
      this.setState({ errors: data });
    }else{
      alert('Perfil actualizado correctamente');
      window.location.href = `${frontend}/user-details/${userId}/`;
    }
  } catch (error) {
    alert('Error actualizando el perfil');
    window.location.href = '/';
  }
 };
 
 

 render() {
    const { errors } = this.state;

    return (
      <div className='edit-profile'>
         <div className='edit-profile-form-container'>
           <div className="edit-profile-data-container">
             <PageTitle title="Editar perfil" />
             <div className="section-title-container">
              <Text type={TEXT_TYPES.TITLE_BOLD} text='Editar perfil' />
              </div>
             <form className='edit-profile-form' onSubmit={this.handleSubmit}>
             <div className='edit-profile-group'>
                 {/* Utiliza el estado image_url para determinar qué imagen mostrar */}
                 <img className='avatar' src={this.state.preview !== null ? this.state.preview : this.state.avatar} onClick={this.onClick} />
                <img className='edit-icon' src={editIcon} onClick={this.onClick} />
                {this.state.modal && (<Modal modal={this.state.modal} toggle={() => this.setState({modal: false})} setImage={this.setImage}/>)}
              </div>
               <div className='edit-profile-form-group'>
                 <label htmlFor='email'>Correo electrónico</label>
                 <input type='email' id='email' name='email' className='form-input' placeholder='ejemplo@ejemplo.com' value={this.state.email} onChange={this.handleChange} required />
               </div>
               <div className='edit-profile-form-group'>
                 <label htmlFor='address'>Dirección</label>
                 <input type='text' id='address' name='address' className='form-input' placeholder='Calle Ejemplo 123' value={this.state.address} onChange={this.handleChange} required />
               </div>
               <div className='edit-profile-form-row'>
                 <div className='edit-profile-form-group left'>
                   <label htmlFor='postal_code'>Código postal</label>
                   <input type='text' id='postal_code' name='postal_code' className='form-input' placeholder='12345' value={this.state.postal_code} onChange={this.handleChange} required />
                 </div>
                 <div className='edit-profile-form-group right'>
                   <label htmlFor='city'>Ciudad</label>
                   <input type='text' id='city' name='city' className='form-input' placeholder='Ciudad Ejemplo' value={this.state.city} onChange={this.handleChange} required />
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
