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
        <footer className='footer'>
            <div className='footer-section'>
                <img src={logo} className='logo-footer' onClick={() => onButtonClick('/')} />
                <div className='social'>
                    <img src={facebookIcon} className='social-media-icon' onClick={() => onButtonClick('/')} />
                    <img src={instagramIcon} className='social-media-icon' onClick={() => onButtonClick('/')} />
                    <img src={twitterIcon} className='social-media-icon' onClick={() => onButtonClick('/')} />
                </div>
            </div>
            <div className='footer-section'>
                <p className='footer-section-title'>Información relevante</p>
                <p className='footer-section-element'>
                    <a href='/myOrders'>Seguimiento de pedidos</a>
                </p>
            </div>
            <div className='footer-section'>
                <p className='footer-section-title'>El equipo de SHAR3D</p>
                <p className='footer-section-element'>
                    <a href='https://landing-page-shar3d.vercel.app/'>Sobre nosotros</a>
                </p>
                <p className='footer-section-element'>
                    <a href='https://landing-page-shar3d.vercel.app/#contact'>Contacto</a>
                </p>
            </div>
            <div className='footer-section'>
                <p className='footer-section-title'>Nuestras políticas</p>
                <p className='footer-section-element'>
                    <a href='/privacidad'>Política de privacidad</a>
                </p>
                <p className='footer-section-element'>
                    <a href='/terminos'>Términos y condiciones</a>
                </p>
                <p className='footer-section-element'>
                    <a href='/'>Política de cookies</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer