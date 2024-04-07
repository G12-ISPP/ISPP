import React, { useEffect, useState } from "react";
import "./Product.css";
import Button, { BUTTON_TYPES } from "./Button/Button";
import Text, { TEXT_TYPES } from "./Text/Text";
import PageTitle from "./PageTitle/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AddProductReport from "./AddProductReport";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      product: null,
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

  render() {
    const { product, user, currentUserId } = this.state;
    if (!product || !user) {
      return <div>Loading...</div>;
    }

    const cart = this.props.cart;
    const setCart = this.props.setCart;
    const { agregado } = this.state;

    const addProduct = (product) => {
      let cartCopy = [...cart];

      let existingProduct = cartCopy.find(
        (cartProduct) => cartProduct.id == product.id
      );

      if (currentUserId && currentUserId === user.id) {
        alert("No puedes comprar tu propio producto");
        return;
      }

      if (existingProduct) {
        if (product.stock_quantity - existingProduct.quantity < 1) {
          alert("No hay suficiente stock disponible");
          return;
        }
        existingProduct.quantity += 1;
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
            quantity: 1,
          });
        } else {
          alert("No hay stock disponible");
        }
      }

      setCart(cartCopy);
      localStorage.setItem("cart", JSON.stringify(cart));
    };

    const showEditButton = product.seller === currentUserId;
    const { showForm } = this.state;
    return (
      <>
        <PageTitle title={product.name} />
        <div className="section-title-container">
          <Text type={TEXT_TYPES.TITLE_BOLD} text="Detalles del producto" />
        </div>
        <div className="product-container">
          <div className="product-img-container">
            <img
              id="podruct-img"
              className="img"
              src={
                product.imageRoute
                  ? "/images/" + product.imageRoute
                  : product.image_url
              }
              alt={product.name}
            />
          </div>
          <div className="product-summary">
            <div>
              <h2 className="product-detail-label">{product.name}</h2>
              <AddProductReport product={product} />
              <Link
                to={`/user-details/${user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>
                  <FontAwesomeIcon icon={faUser} /> {user.first_name}{" "}
                  {user.last_name}
                </h3>
              </Link>
              <h3 className="product-detail-label">Detalles:</h3>
              <p>{product.description}</p>

              <h3 className="product-detail-label">
                Precio: {product.price} €
              </h3>
            </div>
            <div className="buy-container">
              <h3>Cantidad de stock: {product.stock_quantity}</h3>
              {!showEditButton && (
                <Button
                  type={BUTTON_TYPES.LARGE}
                  text={agregado ? "Añadido" : "Añadir al carrito"}
                  onClick={() => {
                    addProduct(product);
                    this.setState({ agregado: true });
                  }}
                />
              )}
              {showEditButton && (
                <Button
                  type={BUTTON_TYPES.LARGE}
                  text="Editar producto"
                  onClick={this.handleEditProduct}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProductDetail;
