import React from 'react'
import './Navbar.css'

const Navbar = () => {

    const onButtonClick = (path) => {
        window.location.href = path;
    }

    return (
        <div className='navbar'>
            <ul>
                <li onClick={() => onButtonClick('/')}>Diseños</li>
                <li onClick={() => onButtonClick('/')}>Piezas</li>
                <li onClick={() => onButtonClick('/')}>Impresoras</li>
                <li onClick={() => onButtonClick('/')}>Materiales</li>
                <li onClick={() => onButtonClick('/')}>Artistas</li>
                <li onClick={() => onButtonClick('/')}>Comunidad</li>
                <li onClick={() => onButtonClick('/designs/searching_printer/')}>Modelos a imprimir</li>

            </ul>
        </div>
    )
}

export default Navbar
