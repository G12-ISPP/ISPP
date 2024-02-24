import React from "react";

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
    this.setState({ product });
  }

  render() {
    const { product } = this.state;
    if (!product) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: {product.price} €</p>
      </div>
    );
  }
}

export default ProductDetail;