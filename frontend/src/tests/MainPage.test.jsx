import { test } from 'vitest'
import { render, screen } from "@testing-library/react";
import MainPage from '../pages/MainPage'
import '@testing-library/jest-dom'


test('renders MainPage without crashing', () => {
  render(<MainPage />)
})

test('contains expected texts', () => {
    mockFetch([
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
          // Add more products here...
        ])

    mockFetch([
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
          // Add more products here...
        ])

    mockFetch([
        { name: "Antonio"}
    ])


    mockFetch([
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
          // Add more products here...
        ])

    mockFetch([
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
          // Add more products here...
        ])

  render(<MainPage />)
  
  expect(screen.getByText('¡Explora la innovación en 3D!')).toBeInTheDocument()
  expect(screen.getByText('Encuentra diseños, impresoras y materiales de alta calidad.')).toBeInTheDocument()
  expect(screen.getByText('¡Haz tus ideas realidad!')).toBeInTheDocument()
  expect(screen.getByText('Diseños destacados')).toBeInTheDocument()
  expect(screen.getByText('Mejores artistas')).toBeInTheDocument()
  expect(screen.getByText('Impresoras a la venta')).toBeInTheDocument()
  expect(screen.getByText('Materiales a la venta')).toBeInTheDocument()

  const solicitarImpresionElement = screen.getByRole('button', { name: 'Solicitar impresión' });
  expect(solicitarImpresionElement).toBeInTheDocument();
})

function mockFetch(object) {
    vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
        return ({
            ok: true,
            json: () => (object),
        });
    });
}