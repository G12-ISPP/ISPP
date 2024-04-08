import React from "react";
import "./UsersList.css";
import Text, { TEXT_TYPES } from "../Text/Text";
import PageTitle from '../PageTitle/PageTitle';

const backend = import.meta.env.VITE_APP_BACKEND;

export default class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      avatar: "/images/avatar.svg",
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
                    throw new Error('Error al obtener al usuario');
                }
                const userData = await response.json();
                if (!userData.is_staff) {
                    alert('No tienes permisos para acceder a esta página');
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Error al obtener al usuario:', error);
            }
        };
        fetchUserData();
    }else {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '/';
    }
    const petition = `${backend}/users/api/v1/users/non_admin_users/`;

    const fetchUsers = async () => {
      try {
        const response = await fetch(petition);
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const users = await response.json();
        this.setState({ users });
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsers();
  }

  toggleUserActiveStatus = async (userId, isActive) => {
    const url = `${backend}/users/api/v1/users/${userId}/toggle_active/`;
    const token = localStorage.getItem('token'); 

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                is_active: isActive
            })
        });

        if (!response.ok) {
            alert('No se ha podido bloquear/desbloquear el usuario');
        }

        this.setState(prevState => ({
            users: prevState.users.map(user => user.id === userId ? {...user, is_active: isActive} : user)
        }));
    } catch (error) {
        console.error('Error:', error);
    }
};


  render() {
    const { users, avatar } = this.state;

    return (
        <>
        {users ? (
          <>
            <PageTitle title="Panel de administrador" />
            <div className="profile-title-container">
              <Text type={TEXT_TYPES.TITLE_BOLD} text='Listado de usuarios' />
            </div>
            <div className="users-list">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <img className="avatar-list" src={user.profile_picture ? user.profile_picture : avatar} alt="user" />
                        <h3><a className="user-link" onClick={() => window.location.href = `/user-details/${user.id}`}>{user.username}</a></h3>
                        {user.is_active ?
                        <button className="plain-btn button red" onClick={() => this.toggleUserActiveStatus(user.id, !user.is_active)}>
                            Bloquear
                        </button>
                        : <button className="plain-btn button green" onClick={() => this.toggleUserActiveStatus(user.id, !user.is_active)}>
                            Desbloquear
                          </button>}
                    </div>
                ))}
            </div>
          </>
          ) : <div>Loading...</div>}
      </>
    );
  }
}