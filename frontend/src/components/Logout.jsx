import React from 'react';

export default class Logout extends React.Component{
    async componentDidMount() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    render() {
        return null; 
    }
}