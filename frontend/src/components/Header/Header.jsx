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
                <input type='text' placeholder='Search for designs, printers, materials and more...' className='input-text' />
            </div>

            <div class="button-wrapper">
                <img src={cartIcon} className='cart-icon' onClick={() => onButtonClick('/')} />
                <Button type={BUTTON_TYPES.HEADER} text='Log in' path='/designs/my-design' />
                <Button type={BUTTON_TYPES.HEADER} text='Sell' path='/designs/my-design' />
            </div>

        </div>
    )
}

export default Header
