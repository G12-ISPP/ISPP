import {useEffect, useState} from "react";
import '../Cart/Cart.css';
import myOrder1 from '../../assets/myOrders1.jpeg';
import myOrder2 from '../../assets/myOrders2.jpeg';
import myOrder3 from '../../assets/myOrders3.jpeg';
import myOrder4 from '../../assets/myOrders4.jpeg';

import './myOrders.css'
import searchIcon from '../../assets/bx-search.svg';
import Button, {BUTTON_TYPES} from "../Button/Button";
import PageTitle from "../PageTitle/PageTitle";


const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);

const MyOrders = () => {

    function esIdSQLite(cadena) {
        const esUUID = /^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$/.test(cadena);
        return esUUID;
    }

    const [orders, setOrders] = useState([])
    const [empty, setEmpty] = useState([])
    const [searchId, setSearchId] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem('token')) {
                try {
                    let petition = backend + '/order/myorders';
                    petition = petition.replace(/"/g, '');
                    const response = await fetch(petition, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    });
                    const datos = await response.json();
                    setOrders(datos.orders)
                    setEmpty(datos.empty)
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchData();

    }, []);

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchId(searchTerm);
    }
    const handleSearchClick = async () => {
        try {
            if (esIdSQLite(searchId)) {
                let petition = backend + '/order/details/';
                petition = petition.replace(/"/g, '');
                petition = petition + searchId
                const response = await fetch(petition);
                const datos = await response.json();
                setSearchResult(datos)
                setError(datos.error)
            } else {
                setError('Debe introducir un id con el formato correcto')
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            handleSearchClick()
        }
    };

    let estadoSearch = null
    if (searchResult) {
        switch (searchResult.status) {
            case 'P':
                estadoSearch = 'Pendiente'
                break;
            case 'C':
                estadoSearch = 'Cancelado'
                break;
            case 'E':
                estadoSearch = 'Enviado'
                break;
            case 'R':
                estadoSearch = 'En Reparto'
                break;
            default:
                break;
        }
    }

    const handleClickOrder = (e) => {
        e.preventDefault()
        window.location.href = '/order/details/' + searchResult.id
    }

    const getImageOrder = (price) => {
        const remainder = price % 4;
        switch (remainder) {
            case 0:
                return myOrder1;
            case 1:
                return myOrder2;
            case 2:
                return myOrder3;
            default:
                return myOrder4;
        }
    };



    return (
        <>
            <PageTitle title="Mis pedidos"/>
            <div className="wrapper">
                {localStorage.getItem('token') ? <h1>Mis Pedidos</h1> : <h1>Buscar pedidos</h1>}
                <div className="project">
                    <div className="shop">
                        {!localStorage.getItem('token') &&
                            <>
                                <div className="search-container">
                                    <div className="search-box-container">
                                        <div className='search-box-order'>
                                            <img src={searchIcon} className='search-icon'/>
                                            <input type='text' placeholder={'Introduzca el id de su pedido'}
                                                   className='input-text'
                                                   value={searchId}
                                                   onChange={handleSearchChange}
                                                   onKeyDown={handleKeyPress}/>
                                        </div>
                                        <Button type={BUTTON_TYPES.LARGE} text='Buscar pedido'
                                                onClick={handleSearchClick}/>
                                    </div>
                                    {error && <p className="error-message">{error}</p>}
                                </div>

                                {searchResult && !error &&
                                    <div className='box' key={searchResult.pk} onClick={handleClickOrder}>
                                        <div className='img-container'>
                                            <img src={getImageOrder(searchResult.price)} alt={searchResult.date}/>
                                        </div>
                                        <div className="content">
                                            <div>
                                                <h3>Pedido realizado: {searchResult.date}</h3>
                                                <h3>Estado: {estadoSearch}</h3>
                                                <h3>Total: {searchResult.price}€</h3>
                                            </div>
                                        </div>
                                    </div>}
                            </>
                        }
                        {localStorage.getItem('token') && orders && empty &&
                            <h4>No se ha realizado ningún pedido todavía</h4>}
                        {orders && !empty && <>{orders.map((order, index) => {

                            const handleClick = (e) => {
                                e.preventDefault()
                                window.location.href = '/order/details/' + order.pk
                            }

                            let estado = null
                            switch (order.status) {
                                case 'P':
                                    estado = 'Pendiente'
                                    break;
                                case 'C':
                                    estado = 'Cancelado'
                                    break;
                                case 'E':
                                    estado = 'Enviado'
                                    break;
                                case 'R':
                                    estado = 'En Reparto'
                                    break;
                                default:
                                    break;
                            }

                            return (
                                <div className='box' key={order.pk} onClick={handleClick}>
                                    <div className='img-container'>
                                        <img src={getImageOrder(order.price)} alt={order.date}/>
                                    </div>
                                    <div className="content">
                                        <div>
                                            <h3>Pedido realizado: {order.date}</h3>
                                            <h3>Estado: {estado}</h3>
                                            <h3>Total: {order.price}€</h3>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}</>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyOrders