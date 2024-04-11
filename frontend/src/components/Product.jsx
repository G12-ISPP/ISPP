import React, { useEffect, useState } from "react";
import './Product.css'
import Button, { BUTTON_TYPES } from './Button/Button';
import Text, { TEXT_TYPES } from "./Text/Text";
import PageTitle from "./PageTitle/PageTitle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import ProfileIcon from "./ProfileIcon/ProfileIcon";
import defaultProfileImage from '../assets/avatar.svg';
import ProductsGrid, { GRID_TYPES } from "./ProductsGrid/ProductsGrid";
import DeleteConfirmationModal from './DeleteConfirmationModal';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      showModal: false
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

    let petition3 = backend + '/designs/loguedUser';
    petition3 = petition3.replace(/"/g, '');
    const response_currentUser = await fetch(petition3, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response_currentUser.ok) {
      const currentUserData = await response_currentUser.json();
      this.setState({currentUserId: currentUserData.id});
      this.setState({user: currentUserData})
    }
  }

  handleEditProduct = () => {
    const { product } = this.state;
    if (product) {
       const editUrl = `/products/${product.id}/edit/`;
       window.location.href = editUrl;
    }
   };

  handleDeleteProduct = () => {
    this.setState({ showModal: true });
  };

  handleCancelDelete = () => {
    this.setState({ showModal: false });
  };

  handleConfirmDelete = async () => {
    const { product } = this.state;
    if (product) {
      let deleteUrl = `${backend}/products/api/v1/products/${product.id}/delete_product/`;
      deleteUrl = deleteUrl.replace(/"/g, '');
      try {
        const response = await fetch(deleteUrl, { method: 'DELETE',headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }, });
        if (response.ok) {
          alert("Producto eliminado correctamente");
          window.location.href = '/';
        } else {
          console.error("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    }
  };

  
   
  render() {
    const { product, user, currentUserId, showModal } = this.state;
    if (!product || !user) {
      return <div>Loading...</div>;
    }

    const cart = this.props.cart;
    const setCart = this.props.setCart;
    const { agregado } = this.state;
    

    const addProduct = product => {
      let cartCopy = [...cart];

      let existingProduct = cartCopy.find(cartProduct => cartProduct.id == product.id);

      if(currentUserId && currentUserId === user.id){
        alert('No puedes comprar tu propio producto');
        return;
      }

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
            image_url: product.image_url,
            stock_quantity: product.stock_quantity,
            product_type: product.product_type,
            quantity: 1
          })
        }else{
          alert('No hay stock disponible')
        }
      }

      setCart(cartCopy)
      localStorage.setItem('cart', JSON.stringify(cart));
    };

    const showEditButton = product.seller === currentUserId;
    const showDeleteButton = (product.seller === currentUserId) || (user.is_staff)

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
              
              <div className="product-info-owner">
                <ProfileIcon image={user && user.profile_picture ? user.profile_picture : defaultProfileImage} name={user && user.username} onClick={user && user.id} showScore="True" userId={user.id} />
              </div>

              <div className="product-info-description">
                <h3 className="product-info-description-label">Detalles:</h3>
                <p className="product-info-description-text">{product.description}</p>
              </div>

              {product.product_type != "D" && <h3 className="product-info-stock"><strong>Cantidad disponible: </strong>{product.stock_quantity} {product.stock_quantity === 1 ? "unidad" : "unidades"}</h3>}
              
              <h2 className="product-info-price">{product.price}€</h2>

              {!showEditButton &&
                <Button type={BUTTON_TYPES.LARGE} text={agregado ? 'Añadido' : 'Añadir al carrito'} onClick={() => {addProduct(product); this.setState({ agregado :true })}} />
              }
              {showEditButton && (
                  <Button type={BUTTON_TYPES.LARGE} text='Editar producto' onClick={this.handleEditProduct} />
              )}
              {showDeleteButton && (
                  <Button type={BUTTON_TYPES.LARGE} text='Eliminar producto' onClick={this.handleDeleteProduct} />
              )}
              {showModal && (
                <DeleteConfirmationModal
                  onCancel={this.handleCancelDelete}
                  onConfirm={this.handleConfirmDelete}
                />
              )}
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