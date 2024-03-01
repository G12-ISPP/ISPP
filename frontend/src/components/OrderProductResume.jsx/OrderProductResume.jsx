import React from 'react'
import '../Cart/Cart.css';


const OrderProductResume = (product) => {
    return (
        <div className='box' key={product.id}>
            <div className='img-container'> 
            <img src={product.image_url ? product.image_url : '/images/' + product.imageRoute} alt={product.name} />
            </div>
            <div className="content">
            <div>
                <h3>Nombre: {product.name}</h3>
                <h3>Precio unitario: {product.price}€</h3>
                <h3>Cantidad: {product.quantity}</h3>
                <h3>Precio: {(product.quantity * product.price).toFixed(2)}€</h3>
            </div>
            </div>
        </div>
    )
}

export default OrderProductResume