import React from 'react'
import './Product.css'
import defaultImage from '../../assets/default_product_image.png'
import Button, { BUTTON_TYPES } from '../Button/Button';
import { FaCartPlus } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from 'react';

const Product = (props) => {
    const images_path = import.meta.env.VITE_IMAGES_PATH;
    const { cart, setCart, product } = props
    const name = props.product.name;
    const price = props.product.price;
    const pathImage = props.product.image_url ? props.product.image_url : props.product.imageRoute;
    const pathDetails = props.product.id;
    const isImageRoute = !props.product.image_url;
    const [showCheckmark, setShowCheckmark] = useState(false);

    const onButtonClick = () => {
        if (!pathDetails) {
            window.location.href = '/';
        } else {
            window.location.href = '/product-details/' + pathDetails;
        }
    }

    function modifyImagePath(pathImage, isImageRoute) {
        let imagePath = defaultImage;

        if (!isImageRoute) {
            imagePath = pathImage;
        } else {
            imagePath = '/images/' + pathImage;
        }

        return imagePath;
    }
    const imageRoute = modifyImagePath(pathImage, isImageRoute);

    const currentUserId = parseInt(localStorage.getItem('userId'));
    const isCurrentUserId = () => { return currentUserId && currentUserId === product.seller };

    const addProduct = (product) => {
        let cartCopy = [...cart];

        console.log(isCurrentUserId());

        let existingProduct = cartCopy.find(cartProduct => cartProduct.id == product.id);

        if (currentUserId && currentUserId === product.seller) {
            alert('No puedes comprar tu propio producto');
            return;
        }

        if (existingProduct) {
            if ((product.stock_quantity - existingProduct.quantity) < 1) {
                alert('No hay suficiente stock disponible')
                return
            }
            existingProduct.quantity += 1
        } else {
            if (product.stock_quantity > 0) {
                setShowCheckmark(true);
                setTimeout(() => {
                    setShowCheckmark(false);
                  }, 5000); 

                cartCopy.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageRoute: product.imageRoute,
                    image_url: product.image_url,
                    stock_quantity: product.stock_quantity,
                    product_type: product.product_type,
                    quantity: 1,
                    user_id: product.user_id
                })
            } else {
                alert('No hay stock disponible')
            }
        }

        setCart(cartCopy)
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <div className='product' onClick={onButtonClick}>

            <div className='product-image'>
                <img src={imageRoute} />
            </div>

            <div className='product-description'>
                <p className='name'>{name}</p>
                <div className='product-prd-container'>
                    {!isCurrentUserId() && (
                        <div>
                            <button style={{ cursor: 'pointer', border: 'none', background: 'none', outline: 'none',  paddingTop: '0.3vh',padding: 0}} onClick={(e) => { e.stopPropagation(); addProduct(product); }}>
                                <FaCartPlus className='product-icon-cart' />
                            </button>
                            {showCheckmark && (
                                <span style={{ position: 'absolute', bottom: '-6px', left: '15px', color: 'green' }}>
                                    <FaCheckCircle />
                                </span>
                            )}
                        </div>
                    )}

                    <p className='price'>{price}€</p>
                </div>

            </div>

        </div>
    )
}

export default Product