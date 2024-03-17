import React, { useEffect } from "react";
import './Product.css'
import Button, { BUTTON_TYPES } from './Button/Button';
import Text, { TEXT_TYPES } from "./Text/Text";
import PageTitle from "./PageTitle/PageTitle";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,

    };
  }

  async componentDidMount() {
    const id = window.location.href.split('/')[4]
    let petition = backend + '/products/api/v1/products/' + id + '/get_product_data/';
    petition = petition.replace(/"/g, '')
    const response = await fetch(petition);
    const product = await response.json();
    let petition2 = backend + '/users/api/v1/users/' + product.seller + '/get_user_data/';
    petition2 = petition2.replace(/"/g, '')
    const response_user = await fetch(petition2);
    const user = await response_user.json();
    this.setState({ product, user });

  }

  render() {
    const { product, user } = this.state;
    if (!product || !user) {
      return <div>Loading...</div>;
    }

    const cart = this.props.cart;
    const setCart = this.props.setCart;

    const addProduct = product => {
      let cartCopy = [...cart];

      let existingProduct = cartCopy.find(cartProduct => cartProduct.id == product.id);

      if (existingProduct) {
        if ((product.stock_quantity - existingProduct.quantity) < 1){
          alert('No hay suficiente stock disponible')
          return
        } 
        existingProduct.quantity += 1
      } else {
        if(product.stock_quantity>0){
          cartCopy.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageRoute: product.imageRoute,
            stock_quantity: product.stock_quantity,
            quantity: 1
          })
        }else{
          alert('No hay stock disponible')
        }
      }

      setCart(cartCopy)
      localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
      <>
        <PageTitle title={product.name} />
        <div className="section-title-container">
          <Text type={TEXT_TYPES.TITLE_BOLD} text='Detalles del producto' />
        </div>
        <div className='product-container'>
          <div className='product-img-container'>
            <img id="podruct-img" className="img" src={product.imageRoute ? '/images/' + product.imageRoute : product.image_url} alt={product.name} />
          </div>
          <div className="product-summary">
            <div>
              <h2 className="product-detail-label">{product.name}</h2>
              <h3>{user.first_name} {user.last_name}</h3>
              <h3 className="product-detail-label">Detalles:</h3>
              <p>{product.description}</p>
              <h3 className="product-detail-label">Precio: {product.price} €</h3>
            </div>
            <div className="buy-container">
              <h3>Cantidad de stock: {product.stock_quantity}</h3>
              <Button type={BUTTON_TYPES.LARGE} text='Añadir al carrito' onClick={() => addProduct(product)} />
            </div>
          </div>
        </div>

      </>
    );
  }
}

export default ProductDetail;