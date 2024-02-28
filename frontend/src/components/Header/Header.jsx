import React, { useEffect, useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/bx-search.svg';
import cartIcon from '../../assets/bx-cart.svg';
import menuIcon from '../../assets/bx-menu.svg';
import exitIcon from '../../assets/bx-x.svg';
import Button, { BUTTON_TYPES } from '../Button/Button';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'));
    const [menuVisible, setMenuVisible] = useState(false);
    const [isHeaderFullScreen, setIsHeaderFullScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setMenuVisible(true);
            } else {
                setMenuVisible(false);
            }
        }

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(null); 
        window.location.href = '/';
    };

    const onButtonClick = (path) => {
        window.location.href = path;
    };

    const onToggleMenu = () => {
        setMenuVisible(!menuVisible);
        setIsHeaderFullScreen(!isHeaderFullScreen);
    }

    return (
        <div className={isHeaderFullScreen ? 'header-fullscreen' : 'header'}>
            <div className={isHeaderFullScreen ? 'logo-container-fullscreen' : 'logo-container'}>
                <img src={logo} className='logo' onClick={() => onButtonClick('/')} />
                <img src={menuVisible ? exitIcon : menuIcon} onClick={onToggleMenu} className='mobile-menu-icon' />
            </div>
                
            {menuVisible && (
                <>
                    <div className='search-box'>
                        <img src={searchIcon} className='search-icon' />
                        <input type='text' placeholder={isHeaderFullScreen ? 'Busca diseños, impresoras y más...' : 'Busca diseños, impresoras, materiales y más...'} className='input-text' />
                    </div>
                    <div className="button-wrapper">
                        <img src={cartIcon} className='cart-icon' onClick={() => onButtonClick('/')} />
                        {!isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Iniciar sesión' path='/login' />}
                        {!isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Registrarse' path='/register' />}
                        {isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Cerrar sesión' path='logout' />}
                        {isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Vender' path='/products/add-product' />}
                    </div>
                </>
            )}
            
        </div>
    );
};

export default Header;