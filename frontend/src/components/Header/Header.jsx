import React from 'react'
import './Header.css'
import logo from '../../assets/logo.png'
import searchIcon from '../../assets/bx-search.svg'
import cartIcon from '../../assets/bx-cart.svg'
import Button, { BUTTON_TYPES } from '../Button/Button'

const Header = () => {

    const onButtonClick = (path) => {
        window.location.href = path;
    }

    return (
        <div className='header'>

            <img src={logo} className='logo' onClick={() => onButtonClick('/')}/>

            <div className='search-box'>
                <img src={searchIcon} className='search-icon' />
                <input type='text' placeholder='Busca diseños, impresoras, materiales y más...' className='input-text' />
            </div>

            <div className="button-wrapper">
                <img src={cartIcon} className='cart-icon' onClick={() => onButtonClick('/')} />
                <Button type={BUTTON_TYPES.HEADER} text='Iniciar sesión' pathDetails='/designs/my-design' />
                <Button type={BUTTON_TYPES.HEADER} text='Vender' pathDetails='/designs/my-design' />
            </div>

        </div>
    )
}

export default Header
