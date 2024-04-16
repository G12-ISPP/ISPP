import React, { Component } from "react";
import "./AddPost.css";
import PageTitle from "../PageTitle/PageTitle";
const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: "",
      description: "",
      errors: {},
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      alert("Debes iniciar sesión para subir un post");
      window.location.href = "/";
    }
  }

  handleFileChange(event) {
    const selectedFile = event.target.files[0];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = selectedFile
      ? selectedFile.name.split(".").pop().toLowerCase()
      : null;

    if (!selectedFile) {
      this.setState({ file: null });
      return;
    }

    if (!allowedExtensions.includes(fileExtension)) {
      this.setState({
        file: null,
        errors: {
          file: "Por favor, seleccione un archivo de imagen válido (.jpg, .jpeg, .png)",
        },
      });
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
      errors.file = "La foto es obligatoria";
    }

    if (!name.trim()) {
      errors.name = "El nombre es obligatorio";
    }

    if (!description.trim()) {
      errors.description = "La descripción es obligatoria";
    }

    this.setState({ errors });

    return Object.keys(errors).length === 0;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      const formData = new FormData();
      formData.append("file", this.state.file);
      formData.append("name", this.state.name);
      formData.append("description", this.state.description);
      let petition1 = backend + "/posts/add-post";
      petition1 = petition1.replace(/"/g, "");
      fetch(petition1, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            alert("Post añadido correctamente");
            window.location.href = "/comunity";
          } else {
            throw new Error("Error al subir la imagen");
          }
        })
        .catch((error) => {
          console.error("Error al enviar el formulario:", error);
          alert("Error al enviar el formulario");
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
        <div className="main-post">
          <h1 className="title">Publicar Post</h1>

          {this.state.imagePreview && (
            <img
              src={this.state.imagePreview}
              alt="Preview"
              className="image-preview-container"
            />
          )}
          <form className="form-post" onSubmit={this.handleSubmit}>
            <div className="form-group-post">
              <label htmlFor="file" className="upload-post">
                Foto
              </label>
              <div className="file-select">
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="file-input-post"
                  accept=".jpg, .jpeg, .png"
                  onChange={this.handleFileChange}
                />
                {errors.file && <div className="error-post">{errors.file}</div>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="name">Título</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input-post"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
                placeholder="Post de mi pieza"
              />
              {errors.name && <div className="error-post">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                className="form-input-post"
                value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value })}
                placeholder="Estoy haciendo esta pieza..."
                rows="5"
              />
              {errors.description && (
                <div className="error-post">{errors.description}</div>
              )}
            </div>
          </form>
          {Object.keys(errors).length > 0 && (
            <div className="error-message-post">
              Por favor, corrija los errores en el formulario
            </div>
          )}
          <button
            className="add-post-button"
            type="button"
            onClick={this.handleSubmit}
          >
            Añadir Post
          </button>
        </div>
      </>
    );
  }
}

export default Post;
