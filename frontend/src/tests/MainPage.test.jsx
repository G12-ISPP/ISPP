import { test } from 'vitest'
import { render, screen } from "@testing-library/react";
import MainPage from '../pages/MainPage'
import '@testing-library/jest-dom'
import { http } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/undefined/products/api/v1/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        // Add more products here...
      ])
    );
  }),
  http.get('/undefined/users/api/v1/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        // Add more users here...
      ])
    );
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders MainPage without crashing', () => {
  render(<MainPage />)
})

test('contains expected texts', () => {
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