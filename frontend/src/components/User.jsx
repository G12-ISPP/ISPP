import React from "react";
import './User.css'

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    async componentDidMount() {
        const id = window.location.href.split('/')[4]
        const response = await fetch(`http://localhost:8000/users/api/v1/users/${id}/get_user_data/`);
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
                <h1 className='title'>Detalles de usuario</h1>

                {user.is_designer || user.is_printer ? (
                    <div>
                        <h2 className='title'>Rol de {user.name} {user.last_name}</h2>
                        <div className="summary">
                            <h3>{user.is_designer === true ? 'Diseñador ' : null}
                                {user.is_printer === true ? ' Impresor' : null}</h3>
                        </div>
                    </div>
                ) : null}


                <div className="main">
                    <img className='img' src='/images/avatar.svg' alt={user.username} />

                    <div className="summary">
                        <div>
                            <h2 className="title-detalle">{user.name}</h2>

                            <h3 className="title-detalle">Localización:</h3>
                            <p>{user.address}</p>
                            <p>{user.city}</p>
                            <p>{user.postal_code}</p>

                            <h3 className="title-detalle">Contacto:</h3>
                            <p>{user.email}</p>
                        </div>
                        <div className="chat">
                        <button className="buy-button">Chat</button>
                    </div>  
                    </div>

                    
                </div>

            </>
        );
    }
}

export default UserDetail;
