import { useEffect, useState } from "react";
import '../Cart/Cart.css';
import myOrder from '../../assets/myOrder.png';
import './myOrders.css'
import searchIcon from '../../assets/bx-search.svg';




const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

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
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
        window.location.href = '/order/details/'+ searchResult.id
      }
    

    return (
        <div className="wrapper">
                <h1>Mis Pedidos</h1>
                <div className="project">
                    <div className="shop">
                    {!localStorage.getItem('token') && 
                    <>
                    <div className="search-container">
                        <div className='search-box-order'>
                                <img src={searchIcon} className='search-icon' onClick={handleSearchClick}/>
                                <input type='text' placeholder={'Introduzca el id de su pedido'} className='input-text' 
                                value={searchId}
                                onChange={handleSearchChange}/>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    
                    {searchResult && !error && 
                        <div className='box' key={searchResult.pk} onClick={handleClickOrder}>
                            <div className='img-container'> 
                            <img src={myOrder} alt={searchResult.date} />
                            </div>
                            <div className="content">
                            <div>
                                <h3>Pedido realizado: {searchResult.date}</h3>
                                <h3>Estado: {estadoSearch}</h3>
                                <h3>Total: {searchResult.price}€</h3>
                            </div>
                            </div>
                        </div> }
                    </>
                    }
                        {localStorage.getItem('token') && orders && empty && <h4>No se ha realizado ningún pedido todavía</h4>}
                        {orders && !empty && <>{orders.map((order, index) => {

                            const handleClick = (e) => {
                                e.preventDefault()
                                window.location.href = '/order/details/'+ order.pk
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
                            <img src={myOrder} alt={order.date} />
                            </div>
                            <div className="content">
                            <div>
                                <h3>Pedido realizado: {order.date}</h3>
                                <h3>Estado: {estado}</h3>
                                <h3>Total: {order.price}€</h3>
                            </div>
                            </div>
                        </div>  
                        )})}</>}   
                    </div>
                </div>
            </div>
    );
}

export default MyOrders