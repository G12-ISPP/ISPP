import { test } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from '../components/Cart/Cart';
import '@testing-library/jest-dom';

// Define un mock para la prop 'cart'
const mockCart = [
  { id: 1, name: 'Product 1', price: 10.99, quantity: 1 },
  { id: 2, name: 'Product 2', price: 20.99, quantity: 2 }
];

test('renderiza Cart sin fallos', () => {
  render(<Cart cart={mockCart} setCart={() => {}} />);
});

test('contains expected elements and buttons', () => {
  render(<Cart cart={mockCart} setCart={() => {}} />);

  // Verificar la presencia de elementos en la página
  expect(screen.getByText('Mi carrito')).toBeInTheDocument();
  expect(screen.getByText('Subtotal')).toBeInTheDocument();
  expect(screen.getByText('Envío')).toBeInTheDocument();
  expect(screen.getByText('Total')).toBeInTheDocument();
  expect(screen.getByText('Finalizar compra')).toBeInTheDocument();

  // Verificar la existencia de botones
  const minusButtons = screen.getAllByRole('button', { name: '-' });
  expect(minusButtons.length).toBeGreaterThan(1);

  const plusButtons = screen.getAllByRole('button', { name: '+' });
  expect(plusButtons.length).toBeGreaterThan(1);

  const trashButtons = screen.getAllByRole('link');
  expect(trashButtons.length).toBeGreaterThan(1);

  // Verificar la existencia de campos de entrada
  const inputFields = screen.getAllByRole('textbox');
  expect(inputFields.length).toBeGreaterThan(0);
});

test('deletes product from cart', () => {
  render(<Cart cart={mockCart} setCart={() => {}} />);

  // Eliminar el primer producto
  const trashButton = screen.getAllByRole('link')[0];
  fireEvent.click(trashButton);

  // Verificar que el producto ha sido eliminado del carrito
  expect(screen.queryByText('Product 1')).not.toBeInTheDocument();

  // Eliminar el segundo producto
  const trashButton2 = screen.getAllByRole('link')[1];
  fireEvent.click(trashButton2);

  // Verificar que el producto ha sido eliminado del carrito
  expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
});


test('edits quantity of product in cart', () => {
  render(<Cart cart={mockCart} setCart={() => {}} />);

  const firstMinusButton = screen.getAllByRole('button', { name: '-' })[1];
  const firstPlusButton = screen.getAllByRole('button', { name: '+' })[1];

  // Reduce la cantidad de un producto
  fireEvent.click(firstMinusButton);
  expect(screen.getByDisplayValue('1')).toBeInTheDocument();

  // Incrementa la cantidad de un producto
  fireEvent.click(firstPlusButton);
  expect(screen.getByDisplayValue('2')).toBeInTheDocument();
});

const mockCartVacio = [];

test('valida bien con todo el formulario vacío', () => {
  render(<Cart cart={mockCartVacio} />);

  fireEvent.click(screen.getByText('Finalizar compra'));

  // Verifica que los mensajes de error esperados aparezcan
  expect(screen.getByText('Por favor, introduce tu correo electrónico.')).toBeInTheDocument();
  expect(screen.getByText('Por favor, introduce el nombre de tu ciudad.')).toBeInTheDocument();
  expect(screen.getByText('Por favor, introduce tu dirección.')).toBeInTheDocument();
  expect(screen.getByText('El código postal debe estar entre 1000 y 52999.')).toBeInTheDocument();
  expect(screen.getByText('Debes añadir al menos un producto al carrito.')).toBeInTheDocument();
}); 
