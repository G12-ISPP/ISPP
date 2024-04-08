import React, { useEffect, useState } from "react";
import "./Product.css";
import Button, { BUTTON_TYPES } from "./Button/Button";
import Text, { TEXT_TYPES } from "./Text/Text";
import PageTitle from "./PageTitle/PageTitle";
import AddProductReport from "./AddProductReport";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import ProfileIcon from "./ProfileIcon/ProfileIcon";
import defaultProfileImage from '../assets/avatar.svg';
import ProductsGrid, { GRID_TYPES } from "./ProductsGrid/ProductsGrid";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      product: null,
      cantidad: 1,
    };
  }

  async componentDidMount() {
    const id = window.location.href.split("/")[4];
    let petition =
      backend + "/products/api/v1/products/" + id + "/get_product_data/";
    petition = petition.replace(/"/g, "");
    const response = await fetch(petition);
    const product = await response.json();
    let petition2 =
      backend + "/users/api/v1/users/" + product.seller + "/get_user_data/";
    petition2 = petition2.replace(/"/g, "");
    const response_user = await fetch(petition2);
    const user = await response_user.json();
    this.setState({ product, user });

    let petition3 = backend + "/designs/loguedUser";
    petition3 = petition3.replace(/"/g, "");
    const response_currentUser = await fetch(petition3, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response_currentUser.ok) {
      const currentUserData = await response_currentUser.json();
      this.setState({ currentUserId: currentUserData.id });
    }
  }

  handleEditProduct = () => {
    const { product } = this.state;
    if (product) {
      const editUrl = `/products/${product.id}/edit/`;
      window.location.href = editUrl;
    }
  };

  incrementarCantidad = () => {
    this.setState((prevState) => ({
      cantidad: Math.min(prevState.cantidad + 1, this.state.product.stock_quantity ),
    }));
  };

  decrementarCantidad = () => {
    this.setState((prevState) => ({
      cantidad: Math.max(prevState.cantidad - 1, 1)
    }));
  };

  render() {
    const { product, user, currentUserId } = this.state;
    if (!product || !user) {
      return <div>Loading...</div>;
    }

    const cart = this.props.cart;
    const setCart = this.props.setCart;
    const { agregado, cantidad } = this.state;


    const addProduct = (product, cantidad) => {
      let cartCopy = [...cart];

      let existingProduct = cartCopy.find(
        (cartProduct) => cartProduct.id == product.id
      );

      if (currentUserId && currentUserId === user.seller) {
        alert('No puedes comprar tu propio producto');
        return;
      }

      if (existingProduct) {
        if ((product.stock_quantity - existingProduct.quantity) < 1) {
          alert('No hay suficiente stock disponible')
          return
        }
        existingProduct.quantity += 1
      } else {
        if (product.stock_quantity > 0) {
          cartCopy.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageRoute: product.imageRoute,
            image_url: product.image_url,
            stock_quantity: product.stock_quantity,
            product_type: product.product_type,
            quantity: cantidad,
            user_id: user.id
          })
        } else {
          alert('No hay stock disponible')
        }
      }

      setCart(cartCopy);
      localStorage.setItem("cart", JSON.stringify(cart));
    };

    const showEditButton = product.seller === currentUserId;
    const { showForm } = this.state;

    function relatedProductsTitle() {
      if (product.product_type === "D") {
        return "Otros diseños destacados";
      } else if (product.product_type === "P") {
        return "Otras impresoras destacadas";
      } else if (product.product_type === "M") {
        return "Otros materiales destacados";
      } else if (product.product_type === "I") {
        return "Otras piezas destacadas";
      }
    }

    function relatedProductsTitle() {
      if (product.product_type === "D") {
        return "Otros diseños destacados";
      } else if (product.product_type === "P") {
        return "Otras impresoras destacadas";
      } else if (product.product_type === "M") {
        return "Otros materiales destacados";
      } else if (product.product_type === "I") {
        return "Otras piezas destacadas";
      }
    }

    return (
      <div className="product-details-page">


        <PageTitle title={product.name} />

        <div className="product-title-container">
          <Text type={TEXT_TYPES.TITLE_BOLD} text='Detalles del producto' />
        </div>

        <div className="product-container">

          <div className="left-product-container">
            <div className="product-img-container">
              <img src={product.imageRoute ? '/images/' + product.imageRoute : product.image_url} alt={product.name} className="product-image" />
            </div>
          </div>

          <div className="right-product-container">
            <div className="product-info-container">
              <h2 className="product-info-name">{product.name}</h2>
              <AddProductReport product={product} />

              
              <div className="product-info-owner">
                <ProfileIcon image={user && user.profile_picture ? user.profile_picture : defaultProfileImage} name={user && user.username} onClick={user && user.id} showScore="True" userId={user.id} />
              </div>

              <div className="product-info-description">
                <h3 className="product-info-description-label">Detalles:</h3>
                <p className="product-info-description-text">{product.description}</p>
              </div>

              {product.product_type != "D" && <h3 className="product-info-stock"><strong>Cantidad disponible: </strong>{product.stock_quantity} {product.stock_quantity === 1 ? "unidad" : "unidades"}</h3>}
              
              <h2 className="product-info-price">{product.price}€</h2>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='product-quantity'>
                  <button className="product-cart-qty-plus" type="button" onClick={this.decrementarCantidad}>-</button>
                  <input type="text" name="qty" min="0" className="qty product-form-control" value={cantidad} readOnly />
                  <button className="product-cart-qty-minus" type="button" onClick={this.incrementarCantidad}>+</button>
                </div>

                {!showEditButton && (
                  <Button type={BUTTON_TYPES.LARGE} text={agregado ? 'Añadido' : 'Añadir al carrito'} onClick={() => { addProduct(product, cantidad); this.setState({ agregado: true }) }} />
                )}
                {showEditButton &&
                  <Button type={BUTTON_TYPES.LARGE} text='Editar producto' onClick={this.handleEditProduct} />
                }
              </div>
            </div>
          </div>

        </div>

        <div className="related-products">
          <Text type={TEXT_TYPES.TITLE_BOLD} text={relatedProductsTitle()} />
          <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} elementType={product.product_type} excludedProducts={[product.id]} />
        </div>


      </div>
    );
  }
}

export default ProductDetail;
