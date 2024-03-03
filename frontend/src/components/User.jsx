import React from "react";
import './User.css'
import Button, { BUTTON_TYPES } from './Button/Button';
import Text, { TEXT_TYPES } from "./Text/Text";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    async componentDidMount() {
        const id = window.location.href.split('/')[4]
        let petition = backend + '/users/api/v1/users/' + id + '/get_user_data/';
        petition = petition.replace(/"/g, '')
        const response = await fetch(petition);
        const user = await response.json();
        this.setState({ user });
    }


    render() {
        const { user } = this.state;
        if (!user) {
            return <div>Loading...</div>;
        }
        return (
            <>
                <div className="section-title-container">
                    <Text type={TEXT_TYPES.TITLE_BOLD} text='Detalles de usuario' />
                </div>

                {user.is_designer || user.is_printer ? (
                    <div className="main-info-container">
                        <h2 className='title'>Rol de {user.first_name} {user.last_name}</h2>
                        <div className="user-role-container">
                            <h3 className="user-role">{user.is_designer === true ? 'Diseñador ' : null}
                                {user.is_printer === true ? ' Impresor' : null}</h3>
                        </div>
                    </div>
                ) : null}


                <div className="main">
                    <div className="user-img-container">
                        <img className='img' src='/images/avatar.svg' alt={user.username} />
                    </div>

                    <div className="profile-summary">
                        <div>
                            <h2 className="title-detalle">{user.first_name} {user.last_name}</h2>

                            <h3 className="title-detalle">Localización:</h3>
                            <p>{user.address}</p>
                            <p>{user.city}</p>
                            <p>{user.postal_code}</p>

                            <h3 className="title-detalle">Contacto:</h3>
                            <p>{user.email}</p>
                        </div>
                        <div className="chat">
                        <Button type={BUTTON_TYPES.TRANSPARENT} text='Chat' />
                    </div>  
                    </div>

                    
                </div>

            </>
        );
    }
}

export default UserDetail;
