import React from 'react'
import './Product.css'
import designImage from '../../assets/design_buzz_lightyear.jpg'

const Product = (props) => {

    const { name, price, pathImage, pathDetails } = props

    const onButtonClick = () => {
        window.location.href = pathDetails;
    }

    return (
        <div className='product' onClick={onButtonClick}>

            <div className='product-image'>
                <img src={pathImage} />
            </div>

            <div className='product-description'>
                <p className='name'>{name}</p>
                <p className='price'>{price}</p>
            </div>

        </div>
    )
}

export default Product
