import React, { Component } from 'react';
import './AddProduct.css';
const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: '',
      description: '',
      price:  0,
      stockQuantity: 1,
      productType: 'P',
      imagePreview: '../../images/design_hucha_cerdo.jpg',
      errors: {}
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileChange(event) {
    const selectedFile = event.target.files[0];
    this.setState({ file: selectedFile });
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ imagePreview: reader.result });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      this.setState({ imagePreview: null });
    }
  }

  validateForm() {
    const { name, description, price, stockQuantity } = this.state;
    const errors = {};

    if (!name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!description.trim()) {
      errors.description = 'La descripción es obligatoria';
    }

    if (price <= 0) {
      errors.price = 'El precio debe ser mayor que cero';
    }

    if (stockQuantity < 0) {
      errors.stockQuantity = 'La cantidad de stock no puede ser negativa';
    }

    this.setState({ errors });

    return Object.keys(errors).length === 0;
  }

  handleSubmit(event) {
    event.preventDefault();
       
    if (this.validateForm()) {
      const formData = new FormData();
      formData.append('file', this.state.file);
      formData.append('name', this.state.name);
      formData.append('description', this.state.description);
      formData.append('price', this.state.price);
      formData.append('stock_quantity', this.state.stockQuantity);
      formData.append('product_type', this.state.productType);
      let petition1 = backend + '/products/add-product';
      petition1 = petition1.replace(/"/g, '')
      let petition2 = backend + '/products/upload-image';
      petition2 = petition2.replace(/"/g, '')
      fetch(petition1, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          const imageFormData = new FormData();
          imageFormData.append('file', this.state.file);
          return fetch(petition2, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: imageFormData
          });
        } else {
          throw new Error('Error al añadir el producto');
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.image_url) {
          this.setState({ imagePreview: data.image_url });
          alert('Producto añadido correctamente');
          window.location.href = '/';
        } else {
          throw new Error('Error al subir la imagen');
        }
      })
      .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert('Error al enviar el formulario');
      });
    } else {
      alert('Por favor, corrija los errores en el formulario');
    }
  }
  
  

  render() {
    const { errors } = this.state;
    return (
      <>
        <h1 className='title'>Mi Producto</h1>
        <div className='main'>
            {this.state.imagePreview && (
                <img src={this.state.imagePreview} alt='Preview' className='image-preview-container' />
            )}
          <form className='form' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor='file' className='upload'>
                Foto
              </label>
              <div className='file-select'>
                <input type='file' id='file' name='file' accept='image/*' onChange={this.handleFileChange} />
                {errors.file && <div className="error">{errors.file}</div>}
              </div>
            </div>
            <div className='form-group'>
              <label className='name'>Nombre</label>
              <input type='text' id='name' name='name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="Cerdito rosa"/>
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
            <div className='form-group'>
              <label className='description'>Descripción</label>
              <textarea id='description' name='description' value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} placeholder="Pieza de un cerdo con dimensiones de 20x12 cm, perfecto estado"/>
              {errors.description && <div className="error">{errors.description}</div>}
            </div>
            <div className='form-group'>
              <label className='price'>Precio</label>
              <input type='text' id='price' name='price' value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} placeholder="5.99"/>
              {errors.price && <div className="error">{errors.price}</div>}
            </div>
            <div className='form-group'>
            <label className='product-type'>Tipo</label>
            <div className='select-container'>
                <select value={this.state.productType} onChange={(e) => this.setState({ productType: e.target.value })}>
                    <option value='P'>Impresora</option>
                    <option value='D'>Diseño</option>
                    <option value='M'>Material</option>
                    <option value='I'>Pieza</option>
                </select>
            </div>
            </div>
            {this.state.productType !== 'D' && (
                <div className='form-group'>
                    <label className='stock-quantity'>Cantidad</label>
                    <input type='number' id='stock-quantity' name='stock-quantity' value={this.state.stockQuantity} onChange={(e) => this.setState({ stockQuantity: e.target.value })} placeholder="2"/>
                    {errors.stockQuantity && <div className="error">{errors.stockQuantity}</div>}
                </div>
            )}
          </form>
        </div>
        <button className='add-product-button' type='button' onClick={this.handleSubmit}>Añadir Producto</button>
      </>
    );
  }
}

export default Product;
