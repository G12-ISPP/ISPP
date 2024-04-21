// Importa las funciones necesarias de Vitest y el componente a probar
import {test} from 'vitest';
import {render, screen} from "@testing-library/react";
import Navbar from '../components/Navbar/Navbar';
import '@testing-library/jest-dom'

const messages = {
    expectedNavigationElements: [
        'Diseños',
        'Impresoras',
        'Materiales',
        'Diseñadores',
        'Comunidad'
    ]
};

describe('Test para Navbar', () => {
    beforeEach(() => {
        render(<Navbar/>);
    });

    test('contains expected navigation elements', () => {
        messages.expectedNavigationElements.forEach(element => {
            expect(screen.getByText(element).tagName).toBe('LI');
        });
    });
});
