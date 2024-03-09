import React, {useEffect, useState} from 'react';
import './Cart.css';
import {FaTrash} from "react-icons/fa";
import Button, {BUTTON_TYPES} from '../Button/Button';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const Cart = ({
  cart,
  setCart,
}) => {
  const [buyerEmail, setBuyerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let petition = backend + '/designs/loguedUser';
        petition = petition.replace(/"/g, '');

        // Obtén el token de acceso del localStorage
        const accessToken = localStorage.getItem('authTokens');
        const parsedAccessToken = JSON.parse(accessToken);
        if (!parsedAccessToken || !parsedAccessToken.access) return;

        const response = await fetch(petition, {
          headers: { 'Authorization': `Bearer ${parsedAccessToken.access}` }
        });
        const datos = await response.json();
        // Actualizar el estado con los datos obtenidos
        setBuyerEmail(datos.email);
        setPostalCode(datos.postal_code);
        setCity(datos.city);
        setAddress(datos.address);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
   
  }, []);

  const deleteProduct = product => {
    const results = cart.filter(
      item => item.id !== product.id
    );

    setCart(results);
  };

  const editProduct = (product, amount) => {
    let cartCopy = [...cart];
    let existingProduct = cartCopy.find(cartProduct => cartProduct.id === product.id);
    if (!existingProduct || (product.stock_quantity - existingProduct.quantity) < amount) return;
    existingProduct.quantity += amount;
    if (existingProduct.quantity <= 0) {
      cartCopy = cart.filter(item => item.id !== product.id);
    }
    setCart(cartCopy);
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleCheckout = async (e) => {
    e.preventDefault(); 

    setErrors({});

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!buyerEmail || buyerEmail === '') {
        newErrors.buyerEmail = 'Por favor, introduce tu correo electrónico.';
    } else if (buyerEmail.length > 255 || !emailRegex.test(buyerEmail)) {
        newErrors.buyerEmail = 'Por favor, verifica que el correo electrónico sea válido y tenga menos de 255 caracteres.';
    }

    if (!city || city === '') {
        newErrors.city = 'Por favor, introduce el nombre de tu ciudad.';
    } else if (city.length > 50) {
        newErrors.city = 'La ciudad debe tener menos de 50 caracteres.';
    }

    if (!address || address === '') {
        newErrors.address = 'Por favor, introduce tu dirección.';
    }   else if (address.length > 255) {
        newErrors.address = 'La dirección debe tener menos de 255 caracteres.';
    }

    if (postalCode < 1000 || postalCode > 52999) {
        newErrors.postalCode = 'El código postal debe estar entre 1000 y 52999.';
    }

    if (cart.length === 0) {
        newErrors.cart = 'Debes añadir al menos un producto al carrito.';
    }

    // Actualizar el estado de los errores si hay nuevos errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cart', JSON.stringify(cart));
      formData.append('buyer_mail', buyerEmail);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('postal_code', postalCode);
      let petition = backend + '/newOrder';
      petition = petition.replace(/"/g, '');
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(petition, {
        method: 'POST',
        headers: headers,
        body: formData
      });
 
      // Verificar si la respuesta es satisfactoria
      if (response.ok) {
        // Obtener el cuerpo de la respuesta como JSON
        const responseData = await response.json();
        // Obtener la URL de pago de PayPal desde los datos de respuesta
        const paypalPaymentUrl = responseData.paypal_payment_url; 
        // Redirigir a la URL de pago de PayPal
        setCart([]);
        window.location.href = paypalPaymentUrl;
      } else {
        // Si la respuesta no es satisfactoria, mostrar un mensaje de error
        alert('Error al realizar la compra');
      }
    } catch(error) {
      // Si hay un error, mostrar un mensaje de error
      alert('Error al realizar la compra');
    }
  };
    

  const totalPrice = () => {
    return cart.reduce((total, product) => total + (parseFloat(product.price) * parseFloat(product.quantity)), 0);
  };

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
                  <a className='trash' href='/cart' onClick={() => deleteProduct(product)}>
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
            <p><span>Envío</span> <span>5 €</span></p>
            <p><span>Total envío</span> <span></span></p>
            <hr />
            <p><span>Total</span> <span>{totalPrice() + 5} €</span></p>
            {errors.cart && <div className='error'>{errors.cart}</div>}
            <div className='checkout-form'>
              <h2>Datos del comprador</h2>
              <div className='form'>
                <form>
                  <div className='form-group'>
                    <label className='buyer_mail'>Correo electrónico:</label>
                    <input type='text' id='buyer_mail' name='buyer_mail' value={buyerEmail} className='form-input' onChange={e => setBuyerEmail(e.target.value)} />
                    {errors.buyerEmail && <div className='error'>{errors.buyerEmail}</div>}
                  </div>
                  <div className="form-group">
                    <label className='address'>Dirección:</label>
                    <input type='text' id='address' name='address' value={address} className='form-input' onChange={e => setAddress(e.target.value)}  />
                    {errors.address && <div className='error'>{errors.address}</div>}
                  </div>
                  <div className="form-group">
                    <label className='city'>Ciudad:</label>
                    <input type='text' id='city' name='city'  value={city} className='form-input' onChange={e => setCity(e.target.value)} />
                    {errors.city && <div className='error'>{errors.city}</div>}
                  </div>
                  <div className="form-group">
                    <label className='postal_code'>Código Postal:</label>
                    <input type='number' id='postal_code' name='postal_code' min={1000} max={52999} value={postalCode} className='form-input' onChange={e => setPostalCode(e.target.value)}/>
                    {errors.postalCode && <div className='error'>{errors.postalCode}</div>}
                  </div>
                  <Button type={BUTTON_TYPES.LARGE} text='Finalizar compra' onClick={handleCheckout} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;