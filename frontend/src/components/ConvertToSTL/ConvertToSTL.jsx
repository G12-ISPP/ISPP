import React, { useState } from 'react';
import './ConvertToSTL.css';

const ConvertToSTL = () => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedExtensions = ['ply', 'step', 'obj', 'vtk', 'xml', 'bmp', 'dae'];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        if(selectedFile.size > 10 * 1024 * 1024) {
            setFile(null);
            setErrors({ file: 'Por favor, seleccione un archivo con un tamaño menor a 10 mb' });
            return;
        }

        if (!allowedExtensions.includes(fileExtension)) {
            setFile(null);
            setErrors({ file: 'Por favor, seleccione un archivo con una extensión permitida (.ply, .step, .obj, .vtk, .xml, .bmp, .dae)' });
            return;
        }

        setFile(selectedFile);
    };

    const validateForm = () => {
        const errors = {};

        if (!file) {
            errors.file = 'El archivo es obligatorio';
        }

        if(file.size > 10 * 1024 * 1024) {
            errors.file = 'Por favor, seleccione un archivo con un tamaño menor a 10 mb' 
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('file', file);

            let petition1 = import.meta.env.VITE_APP_BACKEND + '/conversion/api/v1/convert_to_stl';
            petition1 = petition1.replace(/"/g, '');

            fetch(petition1, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        // Manejar la respuesta como un archivo descargable
                        response.blob().then(blob => {
                            const url = window.URL.createObjectURL(new Blob([blob]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `output_${Date.now()}.stl`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                        alert('Archivo convertido y procesado correctamente');
                    } else {
                        throw new Error('Error al convertir el archivo');
                    }
                })
                .catch(error => {
                    console.error('Error al enviar el formulario:', error);
                    alert('Error al enviar el formulario');
                });
        }
    };

    return (
        <>
            <h1 className='title'>Convertir a STL</h1>
            <div className='main'>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='file' className='upload'>
                            Archivo
                        </label>
                        <div className='file-select'>
                            <input type='file' id='file' name='file' className='form-input' accept='.ply, .step, .obj, .vtk, .xml, .bmp, .dae' onChange={handleFileChange} />
                            {errors.file && <div className="error">{errors.file}</div>}
                        </div>
                    </div>
                </form>
                {Object.keys(errors).length > 0 && (
                    <div className="error-message">Por favor, corrija los errores en el formulario</div>
                )}
            </div>
            <button className='convert-button' type='button' onClick={handleSubmit}>Convertir a STL</button>
        </>
    );
};

export default ConvertToSTL;

