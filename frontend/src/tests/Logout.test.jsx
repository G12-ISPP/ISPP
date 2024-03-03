import { test } from 'vitest'
import { render, screen } from "@testing-library/react";
import MainPage from '../pages/MainPage'
import '@testing-library/jest-dom'

test('Cerrar sesión elimina token del localStorage', () => {
    // Establecer el estado isLoggedIn a true
    localStorage.setItem('token', 'fakeToken');
    expect(localStorage.getItem('token')).not.toBeNull();
    
    // Renderizar el componente Header
    render(<MainPage />);
    setTimeout(() => {
        // Encontrar el botón "Cerrar sesión"
    const closeButton = screen.getByText('Cerrar Sesión');

    // Simular un clic en el botón "Cerrar sesión"
    fireEvent.click(closeButton);

    // Verificar que no existe un token en el localStorage
    expect(localStorage.getItem('token')).toBeNull();
    }, 2000);
    
    
});
