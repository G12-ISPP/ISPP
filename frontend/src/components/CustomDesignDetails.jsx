import React, { Suspense } from 'react';
import './CustomDesign.css';
import PageTitle from './PageTitle/PageTitle';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const url = window.location.href;
const url2 = url.split('/');
const id = url2[url2.length - 1];

export default class CustomModelDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
        };
    }

    async componentDidMount() {
        try {
            let petition = backend + '/designs/details/';
            petition = petition.replace(/"/g, '')
            petition = petition + id;
            const response = await fetch(petition);
            const datos = await response.json();
            this.setState({ data: datos });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render() {
        const { data, error } = this.state;
        return (
            <>
                <Suspense fallback={<div>Loading...</div>}>
                    <PageTitle title="Detalles de la solicitud" />
                    <div style={{textAlign:'center',margin:'30px', fontSize:'20px'}}>
                        <h1>Detalles de tu solicitud de impresión</h1>
                        {error && <p>Error: {error}</p>}
                        {data && (
                            <>
                                <p>Nombre: {data.name}</p>
                                <p>Cantidad: {data.quantity}</p>
                                <p>Color: {data.color === 'red' ? 'rojo' : (data.color === 'green' ? 'verde' : (data.color === 'blue' ? 'azul' : 'Color desconocido'))}</p>
                                <h2>Datos de entrega</h2>
                                <p>Ciudad: {data.city}</p>
                                <p>Código Postal: {data.postal_code}</p>
                                <p>Dirección: {data.address}</p>
                                <p>Estado: {
                                    data.status === 'searching' ? 'Buscando impresor' :
                                    (data.status === 'printing' ? 'Imprimiendo' :
                                    (data.status === 'printed' ? 'Impreso' :
                                    'Estado desconocido'))
                                }</p>
                            </>
                        )}
                    </div>
                    <div className="my-design-summary">

                        <div className="my-design-summary-section-title">
                            Resumen
                        </div>
                        <div className="my-design-summary-contents">
                            {data &&(
                                <>
                                    <h3 className="summary-title">Resumen de tu diseño</h3>

                                    <ul className="summary-list">
                                    <li><strong>Dimensiones: </strong>{data.dimensions.width}cm x {data.dimensions.height}cm x {data.dimensions.depth}cm</li>
                                    <li><strong>Área/Volumen: </strong>{data.area}cm²/ {data.volume}cm³</li>
                                    <li><strong>Peso: </strong>{data.weight}g</li>
                                    <li><strong>Calidad: </strong>{data.quality}</li>
                                    </ul>

                                    <div className="summary-price">
                                    <p className="price">Precio: <strong>{data.price}€</strong></p>
                                    <p className="iva">(IVA y gastos de envío incluidos)</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>



                    
                </Suspense>
            </>
        );
    }
}