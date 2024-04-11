import React, { useEffect, useState } from 'react';
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid';
import ItemsList from './ItemsList/ItemsList';
import Product from './Product/Product';
import PageTitle from './PageTitle/PageTitle';
import Text, { TEXT_TYPES } from "./Text/Text";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
  const id = window.location.href.split('/')[4];
  const currentUserID = localStorage.getItem('userId');
  const [ownUser, setOwnUser] = useState(false);


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
          setSellerName(`${userData.first_name} ${userData.last_name}`);
          if (currentUserID === userData.id.toString()) {
            setOwnUser(true);
          }
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
        console.log(data);
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

      {ownUser ? (
          <div style={{ textAlign: 'center' }} className="section-title-container">
            <Text type={TEXT_TYPES.TITLE_BOLD} text='Mis productos' />
            <PageTitle title={'Mis productos'} />
          </div>
        ) : (
          <div style={{ textAlign: 'center' }} className="section-title-container">
            <Text type={TEXT_TYPES.TITLE_BOLD} text={`Productos de: ${sellerName}`} />
            <PageTitle title={'Productos de ' + sellerName} />
          </div>
        )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Diseños' />
      </div>
      <ItemsList
        items={products
          .filter(product => product.product_type === "D")
          .map(product => (
            <Product
              product={product}
            />
          ))}
      />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Piezas' />
      </div>
      <ItemsList
        items={products
          .filter(product => product.product_type === "I")
          .map(product => (
            <Product
              product={product}
            />
          ))}
      />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Impresoras' />
      </div>
      <ItemsList
        items={products
          .filter(product => product.product_type === "P")
          .map(product => (
            <Product
              product={product}
            />
          ))}
      />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Materiales' />
      </div>
      <ItemsList
        items={products
          .filter(product => product.product_type === "M")
          .map(product => (
            <Product
              product={product}
            />
          ))}
      />
    </>
  );
};

export default ProductList;
