import React from 'react';
import PageTitle from '../PageTitle/PageTitle';
import './Admin.css';
import Text, { TEXT_TYPES } from "../Text/Text";

const backend = import.meta.env.VITE_APP_BACKEND;

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            isAdmin: false,
        };
    }

    async componentDidMount() {
        const id = localStorage.getItem('userId');
        if (id){
            const petition = `${backend}/users/api/v1/users/${id}/get_user_data/`;
    
            const fetchUserData = async () => {
                try {
                    const response = await fetch(petition);
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos del usuario');
                    }
                    const userData = await response.json();
                    this.setState({ user: userData });
                    if (userData.is_staff) {
                        this.setState({ isAdmin: true });
                    } else {
                        alert('No tienes permisos para acceder a esta página');
                        window.location.href = '/';
                    }
                } catch (error) {
                    console.error('Error al obtener los datos del usuario:', error);
                }
            };
            fetchUserData();
        }else {
            alert('No tienes permisos para acceder a esta página');
            window.location.href = '/';
        }
    }

    render() {
        const { user, ownUser, isAdmin } = this.state;

        return (
            <>
              {isAdmin ? (
                <>
                  <PageTitle title="Panel de administrador" />
                  <div className="profile-title-container">
                    <Text type={TEXT_TYPES.TITLE_BOLD} text='Panel de administrador' />
                  </div>
                  <div className="admin-container">
                    <button
                      className='admin-users-button'
                      onClick={() => { window.location.href = '/admin/users' }}
                    >
                        Administrar usuarios
                    </button>
                    </div>
                </>
                ) : <div>Loading...</div>}
            </>
        
          );
    }
    }