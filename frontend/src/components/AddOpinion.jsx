import React, { Component } from 'react';
import './AddOpinion.css';
import Button, { BUTTON_TYPES } from './Button/Button';

const backend = import.meta.env.VITE_APP_BACKEND;

class Opinion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            target_user: this.props.target_user,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            score: 1,
            description: '',
            errors: {},
            isAuthenticated: localStorage.getItem('token') ? true : false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    toggleForm = () => {
        if (this.state.isAuthenticated) {
            this.setState((prevState) => ({ showForm: !prevState.showForm }));
        } else {
            this.setState({ errors: { login: 'Debes iniciar sesión para agregar una opinión.' } });
        }
    };


    handleSubmit = (event) => {
        event.preventDefault();      
        

        const formData = new FormData();
        formData.append('target_user', this.state.target_user);
        formData.append('date', this.state.date);
        formData.append('score', this.state.score);
        formData.append('description', this.state.description);

        if (!this.state.isAuthenticated) {
            this.setState({ errors: { login: 'Debes iniciar sesión para agregar una opinión.' } });
            return;
        }

        let petition = backend + '/opinion/add-opinion';

        petition = petition.replace(/"/g, '');
        fetch(petition, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData,
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json(); // Espera a que se resuelva la promesa de la respuesta
                    throw new Error(errorData.error); // Lanza un error con el mensaje recibido del servidor
                }
                return response.json(); // Retorna los datos JSON si la respuesta es satisfactoria
            })
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error);
                } else {
                    alert('Opinión añadida correctamente');
                    window.location.href = '/user-details/' + this.state.target_user;
                }
            })
            .catch((error) => {
                console.error('Error al enviar el formulario:', error);
                this.setState({ errors: { server: error.message } });
            });
    };

    render() {
        const { errors, isAuthenticated, showForm } = this.state;

        return (
            <div className='new-opinion-container'>
                <Button type={BUTTON_TYPES.LARGE} text={showForm ? 'Ocultar formulario' : 'Añadir opinión'} onClick={this.toggleForm} />
                {errors.login && (
                    <div className="opinion-login-error">
                        <p className='opinion-error-text'>{errors.login}</p>
                        <Button type={BUTTON_TYPES.LARGE} text='Iniciar sesión' path='/login' />
                    </div>
                )}
                
                {showForm && isAuthenticated && (
                    <div className='opinion-form-container'>
                        <form className='opinion-form' onSubmit={this.handleSubmit}>
                            <div className='opinion-form-group'>
                                <label htmlFor='score' className='opinion-form-group-title'>Puntuación</label>
                                <input
                                    type='number'
                                    min={1}
                                    max={5}
                                    id='score'
                                    name='score'
                                    value={this.state.score}
                                    onChange={(e) => this.setState({ score: e.target.value })}
                                    className='opinion-form-group-score'
                                />
                                {errors.score && <span className='opinion-error-text'>{errors.score}</span>}
                            </div>
                            <div className='opinion-form-group'>
                                <label htmlFor='description' className='opinion-form-group-title'>Descripción</label>
                                <textarea type='text' id='desccription' name='description' value={this.state.description}
                                    onChange={(e) => this.setState({ description: e.target.value })}
                                    rows={5}
                                    className='opinion-form-group-description'
                                />
                            </div>
                            {/* {errors.description && <span className='opinion-error-text'>{errors.description}</span>} */}
                            {errors.server && <span className='opinion-error-text'>{errors.server}</span>}
                            <Button type={BUTTON_TYPES.LARGE} text='Publicar Opinión' onClick={this.handleSubmit} />
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

export default Opinion;
