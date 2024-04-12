import React from 'react'
import '../Cart/Cart.css';


const OrderProductResume = (product) => {
    return (
        <div className='box' key={product.id}>
            <div className='img-container'> 
            <img src={product.image_url ? product.image_url : '/images/' + product.imageRoute} alt={product.name} />
            </div>
            <div className="content" style={{ padding: '30px' }}> {/* Incrementa el padding para más espacio desde los bordes */}
                <div style={{ padding: 20 }}>
                    {/* Aplica un estilo inline a los h3 para reducir el margen entre ellos */}
                    <h3 style={{ margin: '10px 0' }}>Nombre: {product.name}</h3> {/* Ejemplo de ajuste de margen */}
                    <h3 style={{ margin: '10px 0' }}>Precio unitario: {product.price}€</h3>
                    <h3 style={{ margin: '10px 0' }}>Cantidad: {product.quantity}</h3>
                    <h3 style={{ margin: '10px 0' }}>Precio: {(product.quantity * product.price).toFixed(2)}€</h3>
                    <h3 style={{ margin: '10px 0' }}>Estado: {product.state}</h3>
                </div>
            </div>

        </div>
    )
}

export default OrderProductResume