import React, { useEffect, useState } from 'react';
import ItemsList from '../components/ItemsList/ItemsList';
import Design from '../components/Design/CustomDesign';
import PageTitle from '../components/PageTitle/PageTitle';
import Text, { TEXT_TYPES } from "../components/Text/Text";
import { Link } from 'react-router-dom';

const RequestList = () => {
    const [designs, setDesigns] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
    const id = window.location.href.split('/')[4];
    const currentUserID = localStorage.getItem('userId');

    useEffect(() => {
        if(currentUserID != id){
            alert("No tienes permiso para acceder aquí")
            window.location.href = '/'; 
            return;
        }

        const fetchDesigns = async () => {
            try {
                let petition = `${backend}/designs/requests/${id}/`;
                petition = petition.replace(/"/g, '');
                const response = await fetch(petition, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setDesigns(data);
                } else {
                    const errorMessage = await response.json();
                    setError(errorMessage.message || 'Error al obtener los custom designs');
                }
            } catch (error) {
                console.error('Error al comunicarse con el backend:', error);
                setError('Error al comunicarse con el backend');
            } finally {
                // Establecer loading como falso después de que la solicitud haya finalizado
                setLoading(false);
            }
        };

        fetchDesigns();
    }, [backend, id]);

    // Si loading es verdadero, mostrar un mensaje de carga
    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <div className="section-title-container">
                <h2 className="titulo-pagina" style={{ textAlign: 'center' }}>Por imprimir</h2>
                <PageTitle title={'Mis solicitudes'} />
            </div>
            {error && <div className="error-message">{error}</div>}
            {!error && designs.length > 0 && (
                <ItemsList
                    items={designs.map(design => (
                        <Link key={design.custom_design_id} to={`/designs/details-to-printer/${design.custom_design_id}`}>
                            <Design design={design} />
                        </Link>
                    ))}
                />
            )}
            {!error && designs.length === 0 && (
                <div className="no-designs-message">No tienes ninguna solicitud de impresión.</div>
            )}
        </>
    );
};

export default RequestList;