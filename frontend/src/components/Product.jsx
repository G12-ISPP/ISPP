import React from "react";
import './Product.css'

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      
    };
  }

  async componentDidMount() {
    const id = window.location.href.split('/')[4]
    const response = await fetch(`http://localhost:8000/products/api/v1/products/${id}/get_product_data/`);
    const product = await response.json();
    const response_user = await fetch(`http://localhost:8000/users/api/v1/users/${product.seller}/get_user_data/`);
    const user = await response_user.json();
    this.setState({ product, user });

  }

  render() {
    const { product, user } = this.state;
    if (!product || !user) {
      return <div>Loading...</div>;
    }
    console.log(user)
    return (
      <>
    <h1 className='title'>Detalles de producto</h1>
    <div className='main'>
        <img className="img" src={'/images/' + product.imageRoute} alt={product.name} />
      <div className="summary">
        <div>
          <h2 className="title-detalle">{product.name}</h2>
          <h3>{user.name} {user.last_name}</h3> 
          <h3 className="title-detalle">Detalles:</h3>
          <p>{product.description}</p>
          <h3 className="title-detalle">Precio: {product.price} €</h3> 
        </div>
        <div className="buy">
          <h3>Cantidad de stock: {product.stock_quantity}</h3>
          <button className="buy-button">Comprar</button>
          </div>
      </div>
    </div>
  
      </>
    );
  }
}

export default ProductDetail;