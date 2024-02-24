import React from 'react'
import './Navbar.css'

const Navbar = () => {

    const onButtonClick = (path) => {
        window.location.href = path;
    }

    return (
        <div className='navbar'>
            <ul>
                <li onClick={() => onButtonClick('/')}>Designs</li>
                <li onClick={() => onButtonClick('/')}>Printers</li>
                <li onClick={() => onButtonClick('/')}>Materials</li>
                <li onClick={() => onButtonClick('/')}>Artists</li>
                <li onClick={() => onButtonClick('/')}>Community</li>
            </ul>
        </div>
    )
}

export default Navbar
