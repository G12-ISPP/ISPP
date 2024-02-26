import React from 'react'
import './Product.css'
import defaultImage from '../../assets/default_product_image.png'

const Product = (props) => {

    const { name, price, pathImage, pathDetails, isImageRoute } = props

    const onButtonClick = () => {
        if (!pathDetails) {
            window.location.href = '/';
        } else {
            window.location.href = '/product-details/' + pathDetails;
        }
    }

    function modifyImagePath(pathImage, isImageRoute) {
        if (!isImageRoute) {
            return pathImage;
        } else {
            return '../../../public/images/' + pathImage;
        }
    }
    const imageRoute = modifyImagePath(pathImage, isImageRoute);    

    return (
        <div className='product' onClick={onButtonClick}>

            <div className='product-image'>
                <img src={imageRoute} />
            </div>

            <div className='product-description'>
                <p className='name'>{name}</p>
                <p className='price'>{price}€</p>
            </div>

        </div>
    )
}

export default Product
