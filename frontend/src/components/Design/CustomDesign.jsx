import React from 'react';
import './CustomDesign.css';

const CustomDesign = (props) => {
    const { name, quantity, dimensions, area, quality, weight, price } = props.design;

    const dimensionsText = dimensions ? `${dimensions.width} x ${dimensions.height} x ${dimensions.depth} cm` : 'Dimensiones no disponibles';

    return (
        <div className='custom-design'>
            <div className='custom-design-description'>
                <p className='name'>{name}</p>
                <p className='quantity'>Cantidad: {quantity}</p>
                <p className='dimensions'>{dimensionsText}</p>
                <p className='quuality'>Calidad: {quality}</p>
                <p className='weight'>Peso: {weight} g</p>
                <p className='price'>{price}€</p>
            </div>
        </div>
    )
}

export default CustomDesign;
