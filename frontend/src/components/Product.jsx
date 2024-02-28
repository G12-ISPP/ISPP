import React from "react";
import './Product.css'

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
        if((product.stock_quantity - existingProduct.quantity) < 1) return
        existingProduct.quantity += 1
      } else {
        cartCopy.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageRoute: product.imageRoute,
          stock_quantity: product.stock_quantity,
          quantity: 1
        })
      }

      setCart(cartCopy)
      localStorage.setItem('cart', JSON.stringify(cart));      
    };

    return (
      <>
    <h1 className='title'>Detalles de producto</h1>
    <div className='main'>
        <img className="img" src={product.imageRoute ? '/images/' + product.imageRoute : product.image_url } alt={product.name} />
      <div className="summary">
        <div>
          <h2 className="title-detalle">{product.name}</h2>
          <h3>{user.first_name} {user.last_name}</h3> 
          <h3 className="title-detalle">Detalles:</h3>
          <p>{product.description}</p>
          <h3 className="title-detalle">Precio: {product.price} €</h3> 
        </div>
        <div className="buy">
          <h3>Cantidad de stock: {product.stock_quantity}</h3>
          <button onClick={() => addProduct(product)}>
                Añadir al carrito
          </button>
          </div>
        </div>

      </>
    );
  }
}

export default ProductDetail;