import React from 'react'
import './ProfileIcon.css'

const ProfileIcon = (props) => {

    const { image, name, onClick } = props

    const onProfileClick = () => {
        if (onClick) {
            window.location.href = onClick;
        }
    }

    return (
        <div className='profile-icon-container'>
            <img className='profile-icon-image' src={image} alt="profile-image" onClick={onProfileClick} />
            <p className='profile-icon-name' onClick={onProfileClick}>{name}</p>
        </div>
    )
}

export default ProfileIcon
