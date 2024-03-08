import React, { Component } from 'react';
import './AddOpinion.css';
const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class Opinion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target_user: this.props.target_user,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            score: 1,
            description: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    componentDidMount() {
        if (!localStorage.getItem('token')) {
            alert('Debes iniciar sesión para opinar sobre un usuario');
            window.location.href = '/';
        }
    }

    validateForm() {
        const { target_user, date, score, description } = this.state;
        const errors = {};

        if (!description.trim()) {
            errors.description = 'La descripción es obligatoria';
        }

        if (!score.trim()) {
            errors.score = 'La puntuación es obligatoria';
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.validateForm()) {
            const formData = new FormData();
            formData.append('target_user', this.state.target_user);
            formData.append('date', this.state.date);
            formData.append('score', this.state.score);
            formData.append('description', this.state.description);

            let petition = backend + '/opinion/add-opinion';

            petition = petition.replace(/"/g, '')
            fetch(petition, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        alert('Opinión añadida correctamente');
                        window.location.href = '/';
                    } else {
                        throw new Error('Error al subir la opinión');
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
                <h1 className='title'>Opiniones</h1>
                <div className='main'>
                    <form className='form' onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='description'>Descripción</label>
                            <input type='text' id='description' name='description' value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='score'>Puntuación</label>
                            <input type='number' min={1} max={5} id='score' name='score' value={this.state.score} onChange={e => this.setState({ score: e.target.value })} />
                        </div>
                    </form>
                    
                </div>
                
                <button className='add-opinion-button' type='submit' onClick={this.handleSubmit}>Añadir Opinión</button>
            </>
        );
    }
}

export default Opinion;
