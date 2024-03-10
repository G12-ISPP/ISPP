import React, { Component } from 'react';
import './AddOpinion.css';

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
        this.validateForm = this.validateForm.bind(this);
    }

    toggleForm = () => {
        if (this.state.isAuthenticated) {
            this.setState((prevState) => ({ showForm: !prevState.showForm }));
        } else {
            this.setState({ errors: { login: 'Debes iniciar sesión para agregar una opinión.' } });
        }
    };

    validateForm() {
        const { description, score } = this.state;
        const errors = {};

        if (!description.trim()) {
            errors.description = 'La descripción es obligatoria';
        }

        if (score < 1 || score > 5) {
            errors.score = 'La puntuación debe estar entre 1 y 5';
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

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
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ errors: data.error });
                } else {
                    alert('Opinión añadida correctamente');
                    window.location.href = '/user-details/' + this.state.target_user;
                }
            })
            .catch((error) => {
                console.error('Error al enviar el formulario:', error);
                alert(error);
            });
    };

    render() {
        const { errors, isAuthenticated } = this.state;

        return (
            <>
                <h1 className='title'>Opiniones</h1>
                <button className='add-opinion-button' onClick={this.toggleForm}>
                    {this.state.showForm ? 'Ocultar formulario' : 'Añadir mi opinión'}
                </button>
                {errors.login && <p className='error'>{errors.login} <a className='login-button' href="/login">Iniciar sesión</a></p>}
                {this.state.showForm && isAuthenticated && (
                    <>
                        <div className='main'>
                            <form className='form' onSubmit={this.handleSubmit}>
                                <div className='form-group'>
                                    <label htmlFor='description'>Descripción</label>
                                    <textarea
                                        type='text'
                                        id='description'
                                        name='description'
                                        value={this.state.description}
                                        onChange={(e) => this.setState({ description: e.target.value })}
                                        rows={5}
                                    />
                                    {errors.description && <span className='error'>{errors.description}</span>}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='score'>Puntuación</label>
                                    <input
                                        type='number'
                                        min={1}
                                        max={5}
                                        id='score'
                                        name='score'
                                        value={this.state.score}
                                        onChange={(e) => this.setState({ score: e.target.value })}
                                    />
                                    {errors.score && <span className='error'>{errors.score}</span>}
                                </div>
                            </form>
                        </div>
                        <button className='add-opinion-button' type='submit' onClick={this.handleSubmit}>
                            Publicar Opinión
                        </button>
                    </>
                )}
            </>
        );
    }
}

export default Opinion;
