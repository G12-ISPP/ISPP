import { test } from 'vitest'
import { render, screen, fireEvent } from "@testing-library/react";
import Product from '../components/AddProduct';
import '@testing-library/jest-dom'

  
test('Renderiza add-product sin fallos', () => {
  render(<Product />);
})

test('La página contiene estos textos', () => {
  render(<Product />);
  
  // Verifica que los elementos del formulario estén presentes en la página
  expect(screen.getByText('Mi Producto')).toBeInTheDocument();
  expect(screen.getByLabelText('Foto')).toBeInTheDocument();
  expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
  expect(screen.getByLabelText('Precio')).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getByText('Cantidad')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Añadir Producto' })).toBeInTheDocument();
})

test('Valida bien con todo el formulario vacío', () => {
  render(<Product />);
  
  // Simula hacer clic en el botón "Añadir Producto" sin llenar ningún campo
  fireEvent.click(screen.getByText('Añadir Producto'));

  // Verifica que los mensajes de error esperados aparezcan
  expect(screen.getByText('La foto es obligatoria')).toBeInTheDocument();
  expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
  expect(screen.getByText('La descripción es obligatoria')).toBeInTheDocument();
  expect(screen.getByText('El precio debe estar entre 0 y 1,000,000')).toBeInTheDocument();
})

test('Sale el error de formato si metes una letra en el precio', () => {
    render(<Product />);
    const fileInput = screen.getByLabelText('Foto');
  const nameInput = screen.getByLabelText('Nombre');
  const descriptionInput = screen.getByLabelText('Descripción');
  const priceInput = screen.getByLabelText('Precio');
  const selectInput = screen.getByRole('combobox');
  
  fireEvent.change(fileInput, { target: { files: [new File(['dummy'], 'test.jpg', { type: 'image/jpeg' })] }});
  fireEvent.change(nameInput, { target: { value: 'Test Product' } });
  fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
  fireEvent.change(priceInput, { target: { value: 'aa' } });
  fireEvent.change(selectInput, { target: { value: 'P' } });

    fireEvent.click(screen.getByText('Añadir Producto'));

    expect(screen.getByText('El precio debe tener el formato correcto (por ejemplo, 5.99)')).toBeInTheDocument();
  })


  test('Formulario con todos los datos correctos', () => {
    render(<Product />);
  
    // Llena el formulario con datos válidos
    const fileInput = screen.getByLabelText('Foto');
    const nameInput = screen.getByLabelText('Nombre');
    const descriptionInput = screen.getByLabelText('Descripción');
    const priceInput = screen.getByLabelText('Precio');
    const selectInput = screen.getByRole('combobox');
    
    fireEvent.change(fileInput, { target: { files: [new File(['dummy'], 'test.jpg', { type: 'image/jpeg' })] }});
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(priceInput, { target: { value: '10.99' } });
    fireEvent.change(selectInput, { target: { value: 'P' } });
  
    // Simula hacer clic en el botón "Añadir Producto"
    fireEvent.click(screen.getByText('Añadir Producto'));
  
    // Verifica que no haya mensajes de error presentes
    expect(screen.queryByText('La foto es obligatoria')).not.toBeInTheDocument();
    expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument();
    expect(screen.queryByText('La descripción es obligatoria')).not.toBeInTheDocument();
    expect(screen.queryByText('El precio debe estar entre 0 y 1,000,000')).not.toBeInTheDocument();
    
  });

  
  