import React, { useEffect, useState } from 'react';
import './Navbar.css';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPrinter, setIsPrinter] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let petition = backend + '/designs/loguedUser';
                petition = petition.replace(/"/g, '');
                const response = await fetch(petition, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setIsPrinter(userData.is_printer);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (localStorage.getItem('token')) {
            fetchData();
        }
    }, []);

    const onButtonClick = (path) => {
        window.location.href = path;
    };

    return (
        <div className='navbar'>
            <ul>
                <li onClick={() => onButtonClick('/')}>Diseños</li>
                <li onClick={() => onButtonClick('/')}>Piezas</li>
                <li onClick={() => onButtonClick('/')}>Impresoras</li>
                <li onClick={() => onButtonClick('/')}>Materiales</li>
                <li onClick={() => onButtonClick('/')}>Artistas</li>
                <li onClick={() => onButtonClick('/')}>Comunidad</li>
                {isLoggedIn && isPrinter && (
                    <li onClick={() => onButtonClick('/designs/searching_printer/')}>Modelos a imprimir</li>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
