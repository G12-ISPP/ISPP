import React, { useState, useEffect } from 'react';

const backend = import.meta.env.VITE_APP_BACKEND.replace(/['"]+/g, '');

function FollowButton({ userId }) {
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        fetch(`${backend}/users/api/v1/follow/${userId}/status/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(async response => {
                response = await response.json();
                setFollowing(response.follows);
            })
            .catch(error => {
                console.error('Error al obtener el estado de seguimiento del usuario:', error);
            });
    }, [userId]);

    const handleFollowToggle = () => {
        fetch(`${backend}/users/api/v1/follow/${userId}/toggle/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(async response => {
                setFollowing(!following);
                response = await response.json();
                alert(response.success)
            })
            .catch(error => {
                console.error('Error al realizar la acción de follow/unfollow:', error);
            });
    };

    return (
        <button className={following ? 'plain-btn button red' : 'plain-btn button green'} onClick={handleFollowToggle}>
            {following ? 'Dejar de seguir' : 'SEGUIR'}
        </button>
    );
}

export default FollowButton;

