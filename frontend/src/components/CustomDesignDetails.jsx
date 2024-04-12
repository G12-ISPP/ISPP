import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Stage, PresentationControls, Html, useProgress } from '@react-three/drei';
import { MeshStandardMaterial, Color, Vector3 } from 'three';
import './CustomDesign.css';
import PageTitle from './PageTitle/PageTitle';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

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
            let petition = backend + '/designs/details/';
            petition = petition.replace(/"/g, '')
            petition = petition + id;
            const response = await fetch(petition);
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
            <PageTitle title="Detalles de la solicitud" />    
            <div className="custom-design-details">
                <h1>Detalles de tu solicitud de impresión</h1>
                {data && <p>Nombre: {data.name}</p>}
                {data && <p>Cantidad: {data.quantity}</p>}
                {data && <p>Calidad: {data.quality}</p>}
                {data && <p>Color: {data.color}</p>}
                <h2>Datos de entrega</h2>
                {data && <p>Ciudad: {data.city}</p>}
                {data && <p>Código Postal: {data.postal_code}</p>}
                {data && <p>Dirección: {data.address}</p>}
                {data.printer && <p>Estado: {data.status}</p>}                
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