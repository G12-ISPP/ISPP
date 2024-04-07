import {test} from 'vitest';
import {render, screen, fireEvent} from "@testing-library/react";
import MainPage from '../pages/MainPage';
import '@testing-library/jest-dom';
import {Navigation} from "../components/Navigation.jsx";
import {AuthProvider} from "../context/AuthContext.jsx";
import {MemoryRouter} from "react-router-dom";

const messages = {
    localStorageTokenKey: 'token',
    localStorageTokenValue: 'user',
    logoutButtonText: 'Cerrar sesión'
};

describe('Test para cerrar sesión', () => {
    test('Cerrar sesión elimina token del localStorage', async () => {
        // Establecer el estado isLoggedIn a true
        localStorage.setItem(messages.localStorageTokenKey, messages.localStorageTokenValue);
        expect(localStorage.getItem(messages.localStorageTokenKey)).not.toBeNull();

        // Renderizar el componente MainPage
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Navigation/>
                </AuthProvider>
            </MemoryRouter>
        );

        // Esperar a que el componente se renderice completamente
        await screen.findByText(messages.logoutButtonText);

        // Encontrar el botón "Cerrar sesión"
        const closeButton = screen.getByText(messages.logoutButtonText);

        // Simular un clic en el botón "Cerrar sesión"
        fireEvent.click(closeButton);

        // Verificar que no existe un token en el localStorage después de un tiempo de espera
        setTimeout(() => {
            expect(localStorage.getItem(messages.localStorageTokenKey)).toBeNull();
        }, 2000);
    });
});

