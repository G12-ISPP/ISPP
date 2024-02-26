import React from 'react'
import './Footer.css'
import logo from '../../assets/logo.png'
import facebookIcon from '../../assets/bxl-facebook-circle.svg'
import instagramIcon from '../../assets/bxl-instagram.svg'
import twitterIcon from '../../assets/bxl-twitter.svg'

const Footer = () => {

    const onButtonClick = (path) => {
        window.location.href = path;
    }

    return (
        <div className='footer'>
            <div className='footer-section'>
                <img src={logo} className='logo-footer' onClick={() => onButtonClick('/')} />
                <div className='social'>
                    <img src={facebookIcon} className='social-media-icon' onClick={() => onButtonClick('/')} />
                    <img src={instagramIcon} className='social-media-icon' onClick={() => onButtonClick('/')} />
                    <img src={twitterIcon} className='social-media-icon' onClick={() => onButtonClick('/')} />
                </div>
            </div>
            <div className='footer-section'>
                <p className='footer-section-title'>El equipo de SHAR3D</p>
                <p className='footer-section-element'>
                    <a href='/'>Sobre nosotros</a>
                </p>
                <p className='footer-section-element'>
                    <a href='/'>Contacto</a>
                </p>
            </div>
            <div className='footer-section'>
                <p className='footer-section-title'>Nuestras políticas</p>
                <p className='footer-section-element'>
                    <a href='/'>Política de privacidad</a>
                </p>
                <p className='footer-section-element'>
                    <a href='/'>Términos y condiciones</a>
                </p>
                <p className='footer-section-element'>
                    <a href='/'>Política de cookies</a>
                </p>
            </div>
        </div>
    )
}

export default Footer
