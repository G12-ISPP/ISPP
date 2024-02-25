import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Stage, PresentationControls, Html, useProgress } from '@react-three/drei';
import { MeshStandardMaterial, Color, Vector3 } from 'three';
import './CustomDesign.css';

const url = window.location.href;
const url2 = url.split('/');
const id = url2[url2.length - 1];

export default class CustomModelDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    async componentDidMount() {
        try {
            console.log(id)
            const response = await fetch(`http://localhost:8000/designs/details/${id}`);
            const datos = await response.json();
            this.setState({ data:datos});
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { data } = this.state;
        return (
            <>            
            <div className="custom-design-details">
                <h1>Detalles de tu solicitud de impresión</h1>
                {data && <p>Nombre: {data.name}</p>}
                {data && <p>Cantidad: {data.quantity}</p>}
                {data && <p>Calidad: {data.quality}</p>}
                <h2>Datos de entrega</h2>
                {data && <p>Ciudad: {data.city}</p>}
                {data && <p>Código Postal: {data.postal_code}</p>}
                {data && <p>Dirección: {data.address}</p>}
            </div>

            <div className='summary'>
                <div className='summary-content'>
                    <h2>Resumen de la pieza</h2>
                    {data && <h3>Dimensiones:{data.dimensions.width}cm x {data.dimensions.height}cm x {data.dimensions.depth}cm</h3>}
                    {data &&<h3>Área/Volumen: {data.area}cm²/ {data.volume}cm³ </h3>}
                    {data &&<h3>Peso: {data.weight}g</h3>}
                    {data &&<h3>Precio: <span>{data.price}€ (IVA incluido)</span></h3>}
                </div>
            </div> 
          </>
        );
    }
}