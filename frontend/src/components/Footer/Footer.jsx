import React from 'react'
import './Footer.css'
import logo from '../../assets/logo.png'
import facebookIcon from '../../assets/bxl-facebook-circle.svg'
import instagramIcon from '../../assets/bxl-instagram.svg'
import twitterIcon from '../../assets/bxl-twitter.svg'
import tiktokIcon from '../../assets/bxl-tiktok.svg'
import twitchIcon from '../../assets/bxl-twitch.svg'
import youtubeIcon from '../../assets/bxl-youtube.svg'

const Footer = () => {

    const onButtonClick = (path) => {
        window.location.href = path;
    }

    return (
        <footer className='footer'>
            <div className='footer-section'>
                <img src={logo} className='logo-footer' onClick={() => onButtonClick('/')} />
                <div className='social'>
                    <img src={facebookIcon} className='social-media-icon' onClick={() => onButtonClick('https://www.facebook.com/profile.php?id=61558534868827')} />
                    <img src={instagramIcon} className='social-media-icon' onClick={() => onButtonClick('https://www.instagram.com/shar3d_es')} />
                    <img src={twitterIcon} className='social-media-icon' onClick={() => onButtonClick('https://www.twitter.com/shar3d_2024')} />
                    <img src={tiktokIcon} className='social-media-icon' onClick={() => onButtonClick('https://www.tiktok.com/@shar3d_2024')} />
                    <img src={twitchIcon} className='social-media-icon' onClick={() => onButtonClick('https://www.twitch.com/shar3d_2024')} />
                    <img src={youtubeIcon} className='social-media-icon' onClick={() => onButtonClick('https://www.youtube.com/channel/UCA-3C2FB2mZB-jY1V3KGHnQ')} />
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
                    <a href='https://landing-page-shar3d.vercel.app/#product'>Sobre nosotros</a>
                </p>
                <p className='footer-section-element'>
                    <a href='https://landing-page-shar3d.vercel.app/#contact'>Contacto</a>
                </p>
            </div>
            <div className='footer-section'>
                <p className='footer-section-title'>Nuestras políticas</p>
                <p className='footer-section-element'>
                    <a href='/privacy'>Política de privacidad</a>
                </p>
                <p className='footer-section-element'>
                    <a href='/terminos'>Términos y condiciones</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer