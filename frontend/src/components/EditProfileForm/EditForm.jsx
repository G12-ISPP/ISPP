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
       first_name: '',
       last_name: '',
       email: '',
       address: '',
       postal_code: '',
       city: '',
       description: '',
       is_designer: false,
       is_printer: false,
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
         first_name: userData.first_name,
         last_name: userData.last_name,
         email: userData.email,
         address: userData.address,
         postal_code: userData.postal_code,
         city: userData.city,
         description: userData.description,
         is_designer: userData.is_designer,
         is_printer: userData.is_printer,
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

  /*
  this.state.errors = {};
 
  if(this.state.first_name.trim().length <4 || this.state.first_name.trim().length > 20){
    this.state.errors.first_name = ['El nombre debe tener entre 4 y 20 caracteres'];
  }

  if(this.state.last_name.trim().length <4 || this.state.last_name.trim().length > 40){
    this.state.errors.last_name = ['Los apellidos debe tener entre 4 y 40 caracteres'];
  }

  if(this.state.address.trim().length <4 || this.state.address.trim().length > 40){
    this.state.errors.address = ['La dirección debe tener entre 4 y 40 caracteres'];
  }

  if(this.state.description.trim().length <20 || this.state.description.trim().length > 200){
    this.state.errors.description = ['La descripción debe tener entre 20 y 200 caracteres'];
  }

  if(typeof postal_code === 'undefined'||postal_code < 1000 || postal_code > 52999 || postal_code.toString().includes('.')|| postal_code.toString().includes(',')){
    this.errors.postal_code = ['El código postal debe ser un número entero entre 1000 y 52999'];
  }

  if (Object.keys(this.state.errors).length > 0) {
    return;
  }

  */

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
      formData.append('first_name', this.state.first_name);
      formData.append('last_name', this.state.last_name);
      formData.append('description', this.state.description);
      formData.append('is_designer', this.state.is_designer);
      formData.append('is_printer', this.state.is_printer);
 
     if(this.state.preview !== avatar){
      formData.append('profile_picture', blob, `profile_picture_${this.state.username}.webp`);
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
                 <label htmlFor='first_name'>Nombre</label>
                 <input type='text' id='first_name' name='first_name' className='form-input' placeholder='Pablo' value={this.state.first_name} onChange={this.handleChange} required />
               </div>
               <div className='edit-profile-form-group'>
                 <label htmlFor='last_name'>Apellidos</label>
                 <input type='text' id='last_name' name='last_name' className='form-input' placeholder='Pablo' value={this.state.last_name} onChange={this.handleChange} required />
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
                 {this.state.is_designer && (
                    <div className='edit-profile-form-group'>
                      <label htmlFor='description'>Descripción</label>
                      <input type='text' id='description' name='description' className='form-input-large' placeholder='Ciudad Ejemplo' value={this.state.description} onChange={this.handleChange} required />
                    </div>
                 )}
                 <div className="role-selector">
                  <label htmlFor='is_designer' >
                    <input type='checkbox' id='is_designer' name='is_designer' checked={this.state.is_designer} onChange={() => this.setState({ is_designer: !this.state.is_designer })} />
                    ¿Eres diseñador?
                  </label>
                  <label htmlFor='is_printer'>
                    <input type='checkbox' id='is_printer' name='is_printer' checked={this.state.is_printer} onChange={() => this.setState({ is_printer: !this.state.is_printer })} />
                    ¿Eres impresor?
                  </label>
                </div>
               </div>

               <div className="error-messages-container">
                {this.state.errors.username && <p className="edit-profile-error-message">{'Nombre de usuario: ' + this.state.errors.username[0]}</p>}
                {this.state.errors.email && <p className="edit-profile-error-message">{'Email: ' + this.state.errors.email[0]}</p>}
                {this.state.errors.address && <p className="edit-profile-error-message">{'Dirección: ' + this.state.errors.address[0]}</p>}
                {this.state.errors.postal_code && <p className="edit-profile-error-message">{'Código postal: ' + this.state.errors.postal_code[0]}</p>}
                {this.state.errors.city && <p className="edit-profile-error-message">{'Ciudad: ' + this.state.errors.city[0]}</p>}
                {this.state.errors.first_name && <p className="edit-profile-error-message">{'Nombre: ' + this.state.errors.first_name[0]}</p>}
                {this.state.errors.last_name && <p className="edit-profile-error-message">{'Apellido: ' + this.state.errors.last_name[0]}</p>}
                {this.state.errors.description && <p className="edit-profile-error-message">{'Descripción: ' + this.state.errors.description[0]}</p>}
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
