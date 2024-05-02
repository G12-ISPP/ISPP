import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './AddProduct.css';
import PageTitle from './PageTitle/PageTitle';
import Text, {TEXT_TYPES} from "./Text/Text";
import {getProduct, getProducts, getProductsFromSeller} from "../api/products.api.jsx";
import {getLoggedUser} from "../api/users.api.jsx";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

const EditProduct = () => {
        const {id} = useParams();
        const [productData, setProductData] = useState({
            name: '',
            description: '',
            show: false,
            price: 0,
            stock_quantity: 1,
            imagePreview: '',
            productType: '',
            seller: null,
        });
        const [currentUserData, setCurrentUserData] = useState({
            id: null,
            seller_plan: false,
            designer_plan: false,
        });
        const [file, setFile] = useState(null);
        const [design, setDesign] = useState(null);
        const [countShow, setCountShow] = useState(0);
        const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await getProduct(id);
                if (!productResponse.ok) {
                    throw new Error('Error al cargar los detalles del producto');
                }
                const productData = await productResponse.json();
                setProductData(productData);
                console.log(productData);

                const loggedUserResponse = await getLoggedUser();
                if (!loggedUserResponse.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                const loggedUserData = await loggedUserResponse.json();
                if (loggedUserData.id !== productData.seller) {
                    alert("No tienes permiso para editar este producto.");
                    window.location.href = '/';
                    return;
                }
                setCurrentUserData(loggedUserData);

                const productsResponse = await getProductsFromSeller(productData.seller);
                if (!productsResponse.ok) {
                    throw new Error('Error al cargar los productos del vendedor');
                }
                const productsData = await productsResponse.json();
                const countShow = productsData.filter(product => product.show).length;
                setCountShow(countShow);
            } catch (error) {
                console.error('Error:', error);
                alert('Error al cargar los datos');
            }
        };

        fetchData();
    }, [id, productData.seller]);


        const handleFileChange = (event) => {
            const selectedFile = event.target.files[0];
            const allowedExtensions = ["jpg", "jpeg", "png"];
            if (!selectedFile) {
                setFile(null);
                return;
            }
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                setFile(null);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    file: 'Por favor, seleccione un archivo de imagen válido (.jpg, .jpeg, .png)'
                }));
                return;
            }

            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setProductData(prevData => ({
                    ...prevData,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(selectedFile);
        };

        const handleDesignChange = (event) => {
            const design = event.target.files[0];
            if (!design) {
                return;
            }
            const fileName = design.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension !== 'stl') {
                alert('El archivo no es de formato STL. Por lo tanto lo ignoraremos. Por favor, sube un archivo STL.');
                event.target.value = '';
                return;
            } else {
                setDesign(design);
            }
        }

        const validateForm = () => {
            const errors = {};

            if (productData.product_type === 'D' && !productData.design) {
                errors.file = 'Por favor, seleccione un archivo de diseño';
            }

            if (!productData.name.trim()) {
                errors.name = 'El nombre es obligatorio';
            }

            if (productData.name.trim().length < 3 || productData.name.length > 30) {
                errors.name = 'El nombre debe tener entre 3 y 30 caracteres';
            }

            if (!productData.description.trim()) {
                errors.description = 'La descripción es obligatoria';
            }

            if (productData.description.trim().length < 20 || productData.description.length > 200) {
                errors.description = 'La descripción debe tener entre 20 y 200 caracteres';
            }

            if (productData.show && productData.seller_plan && productData.designer_plan && countShow >= 8) {
                errors.show = 'No puedes más destacar más de 8 productos';
            } else if (productData.show && !productData.seller_plan && productData.designer_plan && countShow >= 3) {
                errors.show = 'Para destacar más de 3 productos necesitas un plan de vendedor';
            } else if (productData.show && productData.seller_plan && !productData.designer_plan && countShow >= 5) {
                errors.show = 'Para destacar más de 5 productos necesitas un plan de diseñador';
            } else if (productData.show && !productData.seller_plan && !productData.designer_plan) {
                errors.show = 'Para destacar productos debe adquirir un plan';
            }

            if (!/^\d+(\.\d{1,2})?$/.test(productData.price)) {
                errors.price = 'El precio debe tener el formato correcto (por ejemplo, 5.99)';
            } else if (parseFloat(productData.price) <= 0 || parseFloat(productData.price) >= 1000000) {
                errors.price = 'El precio debe estar entre 0 y 1,000,000';
            }

            if (productData.productType === 'D') {
                if (productData.stock_quantity !== 1) {
                    errors.stock_quantity = 'Para productos de tipo diseño, la cantidad debe ser 1';
                }
            } else {
                const stock_quantityValue = parseInt(productData.stock_quantity);
                console.log(stock_quantityValue)
                console.log(productData.stock_quantity)

                if (isNaN(stock_quantityValue) || stock_quantityValue < 1 || stock_quantityValue > 100 ) {
                    errors.stock_quantity = 'La cantidad debe ser un número entero entre 1 y 100';
                }
            }

            setErrors(errors);

            return Object.keys(errors).length === 0;
        };


        const handleSubmit = (event) => {
            event.preventDefault();

            if (validateForm()) {
                const formData = new FormData();
                if (file) {
                    formData.append('file', file);
                }
                if (design) {
                    formData.append('design', design);
                }
                formData.append('name', productData.name);
                formData.append('description', productData.description);
                formData.append('show', productData.show);
                formData.append('price', productData.price);
                formData.append('stock_quantity', productData.stock_quantity);
                let petition = backend + '/products/api/v1/products/' + id + '/edit_product/';
                petition = petition.replace(/"/g, '');
                fetch(petition, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Producto actualizado correctamente');
                            const editUrl = `/product-details/${id}/`;
                            window.location.href = editUrl;
                        } else {
                            throw new Error('Error al actualizar el producto');
                        }
                    })
                    .catch(error => {
                        console.error('Error al enviar el formulario:', error);
                        alert('Error al enviar el formulario');
                    });
            } else {
                return;
            }
        };

        return (
            <>
                <div className="upload-product-page">

                    <PageTitle title="Subir producto"/>
                    <div className="upload-product-title-container">
                        <Text type={TEXT_TYPES.TITLE_BOLD} text='Editar producto'/>
                    </div>

                    <div className="upload-product-container">

                        <div className="left-upload-product-container">
                            <div className="product-image">
                                {productData.image_url &&
                                    <img src={productData.image_url} alt='Preview' className='product-image-preview'/>}
                            </div>
                        </div>
                        <div className="right-upload-product-container">
                            <div className="upload-product-data-container">
                                <h2 className="upload-product-data-section-title">Datos sobre el producto</h2>

                                <form className="upload-product-data-form" onSubmit={handleSubmit}>
                                    <div className='form-group'>
                                        {file &&
                                            <p className="image-name"><strong>Imagen seleccionada: </strong>{file.name}</p>}
                                        <label htmlFor="file"
                                               className={file ? "upload-image-button loaded" : "upload-image-button"}>{file ? "Cambiar imagen" : "Seleccionar imagen"}</label>
                                        <input type='file' id='file' name='file' className='form-input upload'
                                               accept='.jpg, .jpeg, .png' onChange={handleFileChange}/>
                                        {errors && errors.file && <div className="error">{errors.file}</div>}
                                    </div>

                                    {productData.productType === 'D' && (
                                        <div className='form-group'>
                                            {design &&
                                                <p className="design-name"><strong>Diseño
                                                    seleccionado: </strong>{design.name}
                                                </p>}
                                            <label htmlFor="file2"
                                                   className={design ? "upload-design-button loaded" : "upload-design-button"}>{design ? "Cambiar diseño" : "Seleccionar diseño"}</label>
                                            <input type='file' id='file2' name='file2' className='form-input upload'
                                                   accept='.stl' onChange={handleDesignChange}/>
                                            {errors.design && <div className="error">{errors.design}</div>}
                                        </div>
                                    )}

                                    <div className='form-group'>
                                        <label htmlFor='name' className='name label'>Nombre</label>
                                        <input type='text' id='name' name='name' className='form-input'
                                               value={productData.name}
                                               onChange={(e) => setProductData(prevData => ({
                                                   ...prevData,
                                                   name: e.target.value
                                               }))} placeholder="Cerdito rosa"/>
                                        {errors.name && <div className="error">{errors.name}</div>}
                                    </div>

                                    <div className='form-group'>
                                        <label htmlFor='description' className='description label'>Descripción</label>
                                        <textarea id='description' name='description' className='form-input'
                                                  value={productData.description}
                                                  onChange={(e) => setProductData(prevData => ({
                                                      ...prevData,
                                                      description: e.target.value
                                                  }))}
                                                  placeholder="Pieza de un cerdo con dimensiones de 20x12 cm, perfecto estado"/>
                                        {errors.description && <div className="error">{errors.description}</div>}
                                    </div>

                                    {productData.productType !== 'D' && (
                                        <div className='form-group'>
                                            <label htmlFor='stock-quantity'
                                                   className='stock_quantity label'>Cantidad</label>
                                            <input type='number' id='stock-quantity' name='stock-quantity'
                                                   className='form-input' value={productData.stock_quantity} min={1}
                                                   max={100}
                                                   onChange={(e) => setProductData({
                                                       ...productData,
                                                       stock_quantity: e.target.value
                                                   })} placeholder="2"/>
                                            {errors.stock_quantity && <div className="error">{errors.stock_quantity}</div>}
                                        </div>
                                    )}

                                    <div className='form-group'>
                                        <label htmlFor='price' className='price label'>Precio</label>
                                        <input type='text' id='price' name='price' className='form-input'
                                               value={productData.price} onChange={(e) => setProductData(prevData => ({
                                            ...prevData,
                                            price: e.target.value
                                        }))} placeholder="5.99"/>
                                        {errors.price && <div className="error">{errors.price}</div>}
                                    </div>

                                    <div className='form-group'>
                                        <div className="form-group-contents">
                                            <input type='checkbox' id='show' name='show' checked={productData.show}
                                                   onChange={(e) => setProductData(prevData => ({
                                                       ...prevData,
                                                       show: e.target.checked
                                                   }))}/>
                                            <label htmlFor='show' className='show label'>Destacar el producto</label>
                                        </div>
                                        {errors.show && <div className="error">{errors.show}</div>}
                                    </div>
                                </form>
                            </div>
                            <button className='large-btn button' type='button' onClick={handleSubmit}>Editar producto
                            </button>
                        </div>

                    </div>

                </div>
            </>
        );
    }
;

export default EditProduct;

