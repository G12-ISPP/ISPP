import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DesignDetails from '../components/Design/CustomDesign';

export const SearchingPrinterDesignsPage = () => {
    const [designs, setDesigns] = useState([]);
    const token = localStorage.getItem('token');
    const backend = import.meta.env.VITE_APP_BACKEND;

    useEffect(() => {
        const url = `${backend}/designs/searching_printer`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            if (response.status === 403) {
                alert('No tienes permiso para acceder a esta página. Solo los impresores pueden ver los diseños.');
                window.location.href = '/';
                throw new Error(`Error en la petición: ${response.status}`);
            }
            if (response.status === 401) {
                alert('No estás logueado. Por favor, inicia sesión.');
                window.location.href = '/login';
                throw new Error(`Error en la petición: ${response.status}`);
            }
            throw new Error(`Error en la petición: ${response.status}`);
        })
        .then(data => {
            setDesigns(data);
        })
        .catch(error => {
            console.error('Hubo un problema con la petición fetch:', error);
        });
        
    }, [token, backend]);

    if (designs.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px',
            }}>
                Actualmente no hay piezas para imprimir.
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
        }}>
            {designs.map((design) => (
                <Link key={design.custom_design_id} to={`/designs/details-to-printer/${design.custom_design_id}`}>
                    <DesignDetails design={design} />
                </Link>
            ))}
        </div>
    );
};
