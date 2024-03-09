import React, { useEffect, useState } from 'react';
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid';
import ItemsList from './ItemsList/ItemsList';
import Product from './Product/Product';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
  const id = window.location.href.split('/')[4];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(id);
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    const fetchSeller = async () => {
      try {
        let petition = `${backend}/users/api/v1/users/${id}/get_user_data/`
        petition = petition.replace(/"/g, '');
        const response = await fetch(petition, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const userData = await response.json();
          console.log(userData)
          setSellerName(`${userData.first_name} ${userData.last_name}`);
        } else {
          console.error('Error al obtener el vendedor');
        }
      } catch (error) {
        console.error('Error al comunicarse con el backend:', error);
      }
    };

    fetchProducts();
    fetchSeller();
  }, [backend, id]);

  const getAllProducts = async (id) => {
    try {
      let petition = backend + '/products/api/v1/products/?seller=' + id;
      petition = petition.replace(/"/g, '');
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
  };

  return (
    <>
      <h1 className='title'>Productos de : {sellerName}</h1>
      <ItemsList
        items={products.map(product => (
          <Product
            key={product.id}
            name={product.name}
            price={product.price}
            pathImage={product.image_url ? product.image_url : product.imageRoute}
            pathDetails={product.id}
            isImageRoute={!product.image_url}
          />
        ))}
      />
    </>
  );
};

export default ProductList;
