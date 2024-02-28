import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/bx-search.svg';
import cartIcon from '../../assets/bx-cart.svg';
import Button, { BUTTON_TYPES } from '../Button/Button';

const Header = ({
	cart,
	setCart,
}) => {

	const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'));

	const handleLogout = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(null);
		window.location.href = '/';
	};

	const [active, setActive] = useState(false);

	const deleteProduct = product => {
		const results = cart.filter(
			item => item.id !== product.id
		);

		setCart(results);
	};

	const onButtonClick = (path) => {
		window.location.href = path;
	};

	const totalPrice = () => {
		return cart.reduce((total, product) => total + (parseFloat(product.price)*parseFloat(product.quantity)), 0);
	}

	const cartTotal = () => {
		return cart.reduce((total, product) => total + parseInt(product.quantity), 0);
	}


	return (
		<div className='header'>
			<img src={logo} className='logo' onClick={() => onButtonClick('/')} />
			<div className='search-box'>
				<img src={searchIcon} className='search-icon' />
				<input type='text' placeholder='Busca diseños, impresoras, materiales y más...' className='input-text' />
			</div>
			<div className="button-wrapper">
				<div className='container-icon'>
					<div
						className='container-cart-icon'
						onClick={() => onButtonClick('/cart')}
						onMouseEnter={() => setActive(true)}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='red'
							color='red'
							className='icon-cart'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
							/>
						</svg>
						<div className='count-products'>
							<span id='contador-productos'>{cartTotal()}</span>
						</div>
					</div>

					<div
					onMouseEnter={() => setActive(true)}
						onMouseLeave={() => setActive(false)}
						className={`container-cart-products ${active ? '' : 'hidden-cart'
							}`}
					>
						{cart.length ? (
							<>
								<div className='row-product'>
									{cart.map(product => (
										<div className='cart-product' key={product.id}>
											<div className="info-cart-product">
												<img className="cart-img" src={'/images/' + product.imageRoute} alt={product.name} />
											</div>
											<div className="info-cart-product">
												<div className="titulo-producto-carrito">{product.name}</div>
											</div>
											<div className="info-cart-product">
												<div className="cantidad-producto-carrito">
													<div>Cantidad:</div>
													<div>{product.quantity}</div>
												</div>
											</div>
											<div className="info-cart-product">
												<div className="precio-producto-carrito">
													{product.price} €
												</div>
											</div>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth='1.5'
												stroke='currentColor'
												className='icon-close'
												onClick={() => deleteProduct(product)}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M6 18L18 6M6 6l12 12'
												/>
											</svg>

										</div>
									))}
								</div>

								<div className='cart-total'>
									<h3>Total:</h3>
									<span className='total-pagar'>{totalPrice()} €</span>
								</div>
								
								<div className='buy'>
									<div className="button-container">
										<button className='button cart-btn' onClick={() => onButtonClick('/cart')}>
											Ver detalles
										</button>
										<button className='button cart-btn'>
											Compra rápida
										</button>
									</div>
								</div>
							</>
						) : (
							<p className='cart-empty'>El carrito está vacío</p>
						)}
					</div>
				</div>
				<div className="button-wrapper">
          <img src={cartIcon} className='cart-icon' onClick={() => onButtonClick('/')} />
          {!isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Iniciar sesión' path='/login' />}
          {!isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Registrarse' path='/register' />}
          {isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Cerrar sesión' path='/logout' />}
          {isLoggedIn && <Button type={BUTTON_TYPES.HEADER} text='Vender' path='/products/add-product' />}
        </div>

			</div>




		</div>
	);
};

export default Header;