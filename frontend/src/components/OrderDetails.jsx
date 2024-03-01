import React, { Suspense } from 'react';
import '././Cart/Cart.css';
import './CustomDesign.css';

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
            let petition = backend + '/order/details/';
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
            <div className="custom-design-details">
                <h1>Detalles del pedido</h1>
                {data && <p>Precio: {data.price}</p>}
                
                <h2>Detalles de entrega</h2>
                {data && <p>Ciudad: {data.city}</p>}
                {data && <p>Código Postal: {data.postal_code}</p>}
                {data && <p>Dirección: {data.address}</p>}

            </div>
            </>
        );
    }
}