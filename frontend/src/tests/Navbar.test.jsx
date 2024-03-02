// Importa las funciones necesarias de Vitest y el componente a probar
import { test } from 'vitest';
import { render, screen } from "@testing-library/react";
import Navbar from '../components/Navbar/Navbar';
import '@testing-library/jest-dom'

test('renders Navbar without crashing', () => {
    render(<Navbar />)
})

test('contains expected navigation elements', () => {
    render(<Navbar />)

    expect(screen.getByText('Diseños').tagName).toBe('LI');
    expect(screen.getByText('Impresoras').tagName).toBe('LI');
    expect(screen.getByText('Materiales').tagName).toBe('LI');
    expect(screen.getByText('Artistas').tagName).toBe('LI');
    expect(screen.getByText('Comunidad').tagName).toBe('LI');

    // Cuando los elementos de navegación funconen correctamente se pueden implementar más tests comprobando el funcionamiento de estos

})