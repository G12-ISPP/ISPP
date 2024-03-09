import React, { useState, useEffect } from 'react';
import './CustomDesignPrinters.css';
import { useParams } from 'react-router-dom';

const backend = import.meta.env.VITE_APP_BACKEND;

const url = window.location.href;
const url2 = url.split('/');
const id = url2[url2.length - 1];

const CustomDesignPrinters = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${backend}/designs/details-to-printer/${id}`);
                const datos = await response.json();
                setData(datos);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
            <div className="custom-design-printers">
                <h2>{data && data.name}</h2>
                <p>Volumen: {data && data.volume} cm³</p>
                <p>Área: {data && data.area} cm²</p>
                <p>Dimensiones: {data && `${data.dimensions.width} x ${data.dimensions.height} x ${data.dimensions.depth} cm`}</p>
                <p>Peso: {data && data.weight} kg</p>
                <p>Calidad: {data && data.quality}</p>
                <p>Cantidad: {data && data.quantity}</p>
                <p>Precio: {data && data.price}€</p>
                <button onClick={() => console.log('Imprimiendo diseño...')}>Imprimir</button>
            </div>
        </>
    );
};

export default CustomDesignPrinters;
