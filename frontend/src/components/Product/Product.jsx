import React from 'react'
import './Product.css'
import defaultImage from '../../assets/default_product_image.png'

const Product = (props) => {

    const { name, price, pathImage, pathDetails } = props

    const onButtonClick = () => {
        if (!pathDetails) {
            window.location.href = '/';
        } else {
            window.location.href = '/product-details/' + pathDetails;
        }
    }

    function modifyImagePath(pathImage) {
        let imagePath = defaultImage;

        if (pathImage) {
            imagePath = '../../../public/images/' + pathImage;
        }

        return imagePath;
    }
    const imageRoute = modifyImagePath(pathImage);

    return (
        <div className='product' onClick={onButtonClick}>

            <div className='product-image'>
                <img src={imageRoute || defaultImage} />
            </div>

            <div className='product-description'>
                <p className='name'>{name}</p>
                <p className='price'>{price}€</p>
            </div>

        </div>
    )
}

export default Product
