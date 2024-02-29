import React, { useState } from 'react'
import './Cart.css';
import { FaTrash } from "react-icons/fa";


const Cart = ({
  cart,
  setCart,
}) => {
  const [quantity, setQuantity] = useState(0);

  const deleteProduct = product => {
    const results = cart.filter(
      item => item.id !== product.id
    );

    setCart(results);
  };


  const editProduct = (product, amount) => {

    let cartCopy = [...cart]

    let existingProduct = cartCopy.find(cartProduct => cartProduct.id == product.id);
    if (!existingProduct || (product.stock_quantity - existingProduct.quantity) < amount) return

    existingProduct.quantity += amount;

    if (existingProduct.quantity <= 0) {
      cartCopy = cart.filter(item => item.id !== product.id);
      console.log('deleteProduct')
    }

    setCart(cartCopy)
    localStorage.setItem('cart', JSON.stringify(cart));
  }



  const totalPrice = () => {
    return cart.reduce((total, product) => total + (parseFloat(product.price)*parseFloat(product.quantity)), 0);
  }

  return (
    <div className='wrapper'>
      <h1>Mi carrito</h1>
      <div className="project">
        <div className="shop">
          {cart.map(product => (
            <div className='box' key={product.id}>
              <div className='img-container'> 
                <img src={product.image_url ? product.image_url : '/images/' + product.imageRoute} alt={product.name} />
              </div>
              <div className="content">
                <div>
                  <h3>Nombre: {product.name}</h3>
                  <h3>Precio: {product.price}€</h3>
                </div>
                <div className='cart-right'>
                  <a className='trash' onClick={() => deleteProduct(product)}>
                    <FaTrash />
                  </a>
                  <div className='button-container'>
                    <button className="cart-qty-plus" type="button" onClick={() => editProduct(product, -1)} value="-">-</button>
                    <input type="text" name="qty" min="0" className="qty form-control" value={product.quantity} readOnly />
                    <button className="cart-qty-minus" type="button" onClick={() => editProduct(product, 1)} value="+">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="right-bar">
            <p><span>Subtotal</span> <span>{totalPrice()} €</span></p>
            <hr />
            <p><span>Envío</span> <span>2 €</span></p>
            <hr />
            <p><span>Total</span> <span>{totalPrice() + 2} €</span></p>
            <div className='finish-button'>
              <button>Finalizar la compra</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart