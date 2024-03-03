import React, { Suspense } from 'react';
import './Cart/Cart.css';
import Product from './Product/Product';
import OrderProductResume from './OrderProductResume.jsx/OrderProductResume';

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
            let i = 0
            for (const p in datos.products) {
                let petition2 = backend + '/products/api/v1/products/' + datos.products[i].id + '/get_product_data/';
                petition2 = petition2.replace(/"/g, '')
                const response2 = await fetch(petition2);
                const product = await response2.json();
                datos.products[i] = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageRoute: product.imageRoute,
                    image_url: product.image_url,
                    quantity: datos.products[i].quantity
                }
                i++
            } 
            this.setState({ data:datos});
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        const { data } = this.state;
        return (           
            <div className="wrapper">
                <h1>Detalles del pedido</h1>
                <p>Estimado cliente, su pedido ha sido realizado correctamente.</p>
                <div className="project">
                    <div className="shop">
                        {data && <>{data.products.map((p, index) => (
                            <OrderProductResume key={index} name={data.products[index].name} price={data.products[index].price} 
                            image_url={data.products[index].image_url} imageRoute={data.products[index].imageRoute}
                            id={data.products[index].id} quantity={data.products[index].quantity} />
                        ))}</>}

                        {data && <h5>Gastos de envío: 5€</h5>}
                        {data && <h2>Precio total: {data.price}€</h2>}

                        <div className='right-bar'>
                            <h2>Detalles de entrega</h2>
                            <hr />
                            {data && <p><span>Correo electrónico:</span> <span>{data.buyer ? data.buyer : data.buyer_mail}</span></p>}
                            {data && <p><span>Ciudad:</span> <span>{data.city}</span></p>}
                            {data && <p><span>Código Postal:</span> <span>{data.postal_code.toString().padStart(5, "0")}</span></p>}
                            {data && <p><span>Dirección:</span> <span>{data.address}</span></p>}
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        );
    }
}