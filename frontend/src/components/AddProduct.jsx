import React, { Component } from 'react';
import './AddProduct.css';

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
      imagePreview: '../../public/design_hucha_cerdo.jpg',
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

  handleSubmit(event) {
    event.preventDefault();
   
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('name', this.state.name);
    formData.append('description', this.state.description);
    formData.append('price', this.state.price);
    formData.append('stock_quantity', this.state.stockQuantity);
    formData.append('product_type', this.state.productType);
   
    fetch('http://127.0.0.1:8000/products/add-product', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert('Producto añadido correctamente');
      } else {
        alert('Error al añadir el producto');
      }
    })
    .catch(error => {
      console.error('Error al enviar el formulario:', error);
      alert('Error al enviar el formulario');
    });
  }

  render() {
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
              </div>
            </div>
            <div className='form-group'>
              <label className='name'>Nombre</label>
              <input type='text' id='name' name='name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
            </div>
            <div className='form-group'>
              <label className='description'>Descripción</label>
              <textarea id='description' name='description' value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} />
            </div>
            <div className='form-group'>
              <label className='price'>Precio</label>
              <input type='number' id='price' name='price' value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} />
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
                <input type='number' id='stock-quantity' name='stock-quantity' value={this.state.stockQuantity} onChange={(e) => this.setState({ stockQuantity: e.target.value })} />
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
