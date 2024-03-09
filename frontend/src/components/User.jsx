import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './User.css';
import Button, {BUTTON_TYPES} from './Button/Button';
import Text, {TEXT_TYPES} from "./Text/Text";
import AuthContext from "../context/AuthContext.jsx";

const UserDetail = () => {
    const [otherUser, setOtherUser] = useState(null);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);


    useEffect(() => {
        const backend = import.meta.env.VITE_APP_BACKEND; // Asegúrate de ajustar esto según tu configuración
        const id = window.location.href.split('/')[4];
        const petition = `${backend}/users/api/v1/users/${id}/get_user_data/`;

        const fetchUserData = async () => {
            try {
                const response = await fetch(petition);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setOtherUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChatClick = async () => {
        const currentUserID = user.user_id;
        const otherUserID = otherUser?.id;
        const petition = `${import.meta.env.VITE_APP_BACKEND}/chat/chatroom/`;

        // Obtén el token de acceso del localStorage
        const accessToken = localStorage.getItem('authTokens');
        const parsedAccessToken = JSON.parse(accessToken);

        if (!parsedAccessToken || !parsedAccessToken.access) {
            console.error('Token de acceso no válido o expirado');
            return;
        }

        try {
            const response = await fetch(petition, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${parsedAccessToken.access}`,
                },
                body: JSON.stringify({currentUserID, otherUserID})
            });

            if (!response.ok) {
                throw new Error('Failed to create or get chatroom');
            }
            const data = await response.json();
            navigate(`/chat/${data.chatroomID}`);
        } catch (error) {
            console.error('Error:', error);
        }


    };

    if (!otherUser) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div className="section-title-container">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Detalles de usuario'/>
            </div>

            {otherUser.is_designer || otherUser.is_printer ? (
                <div className="main-info-container">
                    <h2 className='title'>Rol de {otherUser.first_name} {otherUser.last_name}</h2>
                    <div className="user-role-container">
                        <h3 className="user-role">{otherUser.is_designer === true ? 'Diseñador ' : null}
                            {otherUser.is_printer === true ? ' Impresor' : null}</h3>
                    </div>
                </div>
            ) : null}

            <div className="main">
                <div className="user-img-container">
                    <img className='img' src='/images/avatar.svg' alt={otherUser.username}/>
                </div>

                <div className="profile-summary">
                    <div>
                        <h2 className="title-detalle">{otherUser.first_name} {otherUser.last_name}</h2>

                        <h3 className="title-detalle">Localización:</h3>
                        <p>{otherUser.address}</p>
                        <p>{otherUser.city}</p>
                        <p>{otherUser.postal_code}</p>

                        <h3 className="title-detalle">Contacto:</h3>
                        <p>{otherUser.email}</p>
                    </div>
                    <div className="chat">
                        <Button type={BUTTON_TYPES.TRANSPARENT} text='Chat' onClick={handleChatClick}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetail;
