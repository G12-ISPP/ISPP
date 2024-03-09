import { useEffect, useState } from "react";
import '../Cart/Cart.css';


const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const MyOrders = () => {

    const [orders, setOrders] = useState([])
    const [empty, setEmpty] = useState([])    

    useEffect(() => {
        const fetchData = async () => {
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
        };
      
        fetchData();
       
      }, []);

    return (
        <div className="wrapper">
                <h1>Mis Pedidos</h1>
                <div className="project">
                    <div className="shop">
                        {orders && empty && <h4>No se ha realizado ningún pedido todavía</h4>}
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
                              case 'E':
                                  estado = 'Enviado'
                              case 'R':
                                  estado = 'En Reparto'
                              default:
                                  break;
                            }

                            return (
                            <div className='box' key={order.pk} onClick={handleClick}>
                            <div className='img-container'> 
                            <img src={order.image_url ? order.image_url : '/images/' + order.imageRoute} alt={order.date} />
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