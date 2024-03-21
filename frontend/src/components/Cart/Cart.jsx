import React, { useEffect, useState } from 'react';
import './Cart.css';
import { FaTrash } from "react-icons/fa";
import Text, { TEXT_TYPES } from '../Text/Text';
import Button, { BUTTON_TYPES } from '../Button/Button';
import PageTitle from '../PageTitle/PageTitle';

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
  const [customerAgreementChecked, setCustomerAgreementChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let petition = backend + '/designs/loguedUser';
        petition = petition.replace(/"/g, '');
        const response = await fetch(petition, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
    } else if (address.length > 255) {
      newErrors.address = 'La dirección debe tener menos de 255 caracteres.';
    }

    if (typeof postalCode === 'undefined' || postalCode < 1000 || postalCode > 52999 || postalCode.toString().includes('.') || postalCode.toString().includes(',')) {
      newErrors.postalCode = 'El código postal debe ser un número entero entre 1000 y 52999';
    }

    if (cart.length === 0) {
      newErrors.cart = 'Debes añadir al menos un producto al carrito.';
    }

    if (!customerAgreementChecked && !localStorage.getItem('token')) {
      newErrors.customerAgreement = 'Debes aceptar el acuerdo del cliente para continuar.';
    }

    // Actualizar el estado de los errores si hay nuevos errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("PRUEBA")

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
    } catch (error) {
      // Si hay un error, mostrar un mensaje de error
      alert('Error al realizar la compra');
    }
  };

  const shipCost = () => {
    if (buyerPlan) {
      return 0;
    } else if (cart.some(product => {
      return ['P', 'I', 'M'].includes(product.product_type);
    })) {
      return 5;
    } else {
      return 0;
    }

  };

  const totalPrice = () => {
    return cart.reduce((total, product) => total + (parseFloat(product.price) * parseFloat(product.quantity)), 0);
  };
  const token = localStorage.getItem('token');

  const [buyerPlan, setBuyerPlan] = useState(false);
  const [sellerPlan, setSellerPlan] = useState(false);
  const [designerPlan, setDesignerPlan] = useState(false);
  const fetchData = async () => {
    try {
      let petition = backend + '/designs/loguedUser';
      petition = petition.replace(/"/g, '');
      const response = await fetch(petition, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setBuyerPlan(userData.buyer_plan);
        setSellerPlan(userData.seller_plan);
        setDesignerPlan(userData.designer_plan);
      } 
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    console.log('buyerPlan', buyerPlan);
    console.log('sellerPlan', sellerPlan);
    console.log('designerPlan', designerPlan);
  };

  if (localStorage.getItem('token')) {
    fetchData();
  }

  return (
    <>
      <PageTitle title="Carrito" />
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
                    <div className='button-container'>
                      <button className="cart-qty-plus" type="button" onClick={() => editProduct(product, -1)} value="-">-</button>
                      <input type="text" name="qty" min="0" className="qty form-control" value={product.quantity} readOnly />
                      <button className="cart-qty-minus" type="button" onClick={() => editProduct(product, 1)} value="+">+</button>
                    </div>
                    <div className='trash-container'>
                      <a className='trash' href='/cart' onClick={() => deleteProduct(product)}>
                        <FaTrash />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="right-bar">
              <p><span>Subtotal</span> <span>{totalPrice()} €</span></p>
              <hr />
              <p><span>Envío</span> <span>{shipCost()} €</span></p>
              <hr />
              <p><span>Total</span> <span>{totalPrice() + shipCost()} €</span></p>
              {errors.cart && <div className='error'>{errors.cart}</div>}
              <div className='checkout-form'>
                <h2>Datos del comprador</h2>
                <div className='form'>
                  <form>
                    <div className='form-group'>
                      <label className='buyer_mail'>Correo electrónico*:</label>
                      <input type='text' id='buyer_mail' name='buyer_mail' value={buyerEmail} className='form-input' placeholder='ejemplo@ejemplo.com' onChange={e => setBuyerEmail(e.target.value)} />
                      {errors.buyerEmail && <div className='error'>{errors.buyerEmail}</div>}
                    </div>
                    <div className="form-group">
                      <label className='address'>Dirección*:</label>
                      <input type='text' id='address' name='address' value={address} className='form-input' placeholder='Calle Ejemplo 123' onChange={e => setAddress(e.target.value)} />
                      {errors.address && <div className='error'>{errors.address}</div>}
                    </div>
                    <div className="form-group">
                      <label className='city'>Ciudad*:</label>
                      <input type='text' id='city' name='city' placeholder='Ciudad Ejemplo' value={city} className='form-input' onChange={e => setCity(e.target.value)} />
                      {errors.city && <div className='error'>{errors.city}</div>}
                    </div>
                    <div className="form-group">
                      <label className='postal_code'>Código Postal*:</label>
                      <input type='number' placeholder='12345' id='postal_code' name='postal_code' min={1000} max={52999} value={postalCode} className='form-input' onChange={e => setPostalCode(e.target.value)} />
                      {errors.postalCode && <div className='error'>{errors.postalCode}</div>}
                    </div>
                    {!token && (
                      <div className="form-group">
                        <input type='checkbox' id='customerAgreement' name='customerAgreement' checked={customerAgreementChecked} onChange={e => setCustomerAgreementChecked(e.target.checked)} />
                        <label className='customer-agreement'>Acepto los términos y condiciones descritos <a href="/terminos">aquí*</a></label>
                        {errors.customerAgreement && <div className='error'>{errors.customerAgreement}</div>}
                      </div>
                    )}
                    <div className='fbutton'>
                      <Button type={BUTTON_TYPES.LARGE} text='Finalizar compra' onClick={handleCheckout} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Cart;