import React, { useEffect, useState } from 'react'
import './ProductsGrid.css'
import Product from '../Product/Product';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const ProductsGrid = (consts) => {

    const { gridType, elementType } = consts

    const getGridClass = () => {
        return gridType.toLowerCase() + '-gr grid';
    }

    const getAllProducts = async (elementType) => {
        try {
            let petition = backend + '/products/api/v1/products/?product_type=' + elementType;
            petition = petition.replace(/"/g, '')
            const response = await fetch(petition, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Error al obtener los productos');
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
        }
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {

        async function loadProducts() {
            const res = await getAllProducts(elementType);

            {/*Adaptar código cuando se añada funcionalidad de destacados*/}
            if (gridType === GRID_TYPES.MAIN_PAGE) {
                setProducts(res.slice(0, 5));
            } else {
                setProducts(res);
            }
        }
        loadProducts();

    }, [])

    return (
        <div className={getGridClass()}>
            {products.map(product => (
                <div key={product.id}>
                    <Product name={product.name} price={product.price} pathImage={product.imageRoute} />
                </div>
            ))}
        </div>
    )
}

export default ProductsGrid

export const GRID_TYPES = {
    MAIN_PAGE: 'MAIN-PAGE',
    UNLIMITED: 'UNLIMITED',
    PAGINATED: 'PAGINATED',
}

export const ELEMENT_TYPES = {
    DESIGN: 'D',
    PRINTER: 'P',
    MATERIAL: 'M',
}