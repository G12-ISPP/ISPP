import React, { Component } from 'react';
import '../AddProduct.css';
import PageTitle from '../PageTitle/PageTitle';
const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);


class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: '',
      description: '',
      errors: {},
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }




  componentDidMount() {
    if (!localStorage.getItem('token')) {
      alert('Debes iniciar sesión para subir un post');
      window.location.href = '/';
    }
  }

  handleFileChange(event) {
    const selectedFile = event.target.files[0];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = selectedFile ? selectedFile.name.split('.').pop().toLowerCase() : null;

    if (!selectedFile) {
      this.setState({ file: null });
      return;
    }

    if (!allowedExtensions.includes(fileExtension)) {
      this.setState({ file: null, errors: { file: 'Por favor, seleccione un archivo de imagen válido (.jpg, .jpeg, .png)' } });
      return;
    }

    this.setState({ file: selectedFile });

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ imagePreview: reader.result });
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  validateForm() {
    const { name, description, file, users } = this.state;
    const errors = {};

    if (!file) {
      errors.file = 'La foto es obligatoria';
    }

    if (!name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!description.trim()) {
      errors.description = 'La descripción es obligatoria';
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
      let petition1 = backend + '/posts/add-post';
      petition1 = petition1.replace(/"/g, '')
      fetch(petition1, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
      })
        .then(response => {
          if (response.ok) {
            alert('Post añadido correctamente');
            window.location.href = '/community';
          } else {
            throw new Error('Error al subir la imagen');
          }
        })
        .catch(error => {
          console.error('Error al enviar el formulario:', error);
          alert('Error al enviar el formulario');
        });
    } else {
      return;
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <>
        <PageTitle title="Subir post" />
        
        <div style={{margin: '50px'}}>
          <h1 style={{}}>Subir post</h1>

          <div className="upload-product-container">

          <div className="left-upload-product-container">
            <div className="product-image">
              {this.state.imagePreview && <img src={this.state.imagePreview} alt='Preview' className='product-image-preview'/>}
            </div>
          </div>

          <div className="right-upload-product-container">
            <div className="upload-product-data-container">
              <h2 className="upload-product-data-section-title">Datos sobre el producto</h2>

              <form className="upload-product-data-form" onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  {this.state.file && <p className="image-name"><strong>Imagen seleccionada: </strong>{this.state.file.name}</p>}
                  <label htmlFor="file" className={this.state.file ? "upload-image-button loaded" : "upload-image-button"}>{this.state.file ? "Cambiar imagen" : "Seleccionar imagen"}</label>
                  <input type='file' id='file' name='file' className='form-input upload' accept='.jpg, .jpeg, .png' onChange={this.handleFileChange} />
                  {errors.file && <div className="error">{errors.file}</div>}
                </div>
                {this.state.productType === 'D' && (
                  <div className='form-group'>
                    {this.state.design && <p className="design-name"><strong>Diseño seleccionado: </strong>{this.state.design.name}</p>}
                    <label htmlFor="file2" className={this.state.design ? "upload-design-button loaded" : "upload-design-button"}>{this.state.design ? "Cambiar diseño" : "Seleccionar diseño"}</label>
                    <input type='file' id='file2' name='file2' className='form-input upload' accept='.stl' onChange={this.handleDesignChange} />
                    {errors.design && <div className="error">{errors.design}</div>}
                  </div>
                )}
                <div className='form-group'>
                  <label htmlFor='name' className='name label'>Título</label>
                  <input type='text' id='name' name='name' className='form-input' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="Cerdito rosa" />
                  {errors.name && <div className="error">{errors.name}</div>}
                </div>

                <div className='form-group'>
                  <label htmlFor='description' className='description label'>Descripción</label>
                  <textarea id='description' name='description' className='form-input' value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} placeholder="Estoy haciendo esta pieza..." />
                  {errors.description && <div className="error">{errors.description}</div>}
                </div>

              </form>
            </div>

            <button className='large-btn button' type='button' onClick={this.handleSubmit}>Añadir publicación</button>

          </div>

        </div>
        </div>
        
      </>
    );
  }
}

export default Post;
