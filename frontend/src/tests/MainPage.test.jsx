import { test } from 'vitest'
import { render, screen } from "@testing-library/react";
import MainPage from '../pages/MainPage'
import '@testing-library/jest-dom'

test('renders MainPage without crashing', () => {
  render(<MainPage />)
})

test('contains expected texts', () => {
  render(<MainPage />)
  
  expect(screen.getByText('¡Explora la innovación en 3D!')).toBeInTheDocument()
  expect(screen.getByText('Encuentra diseños, impresoras y materiales de alta calidad.')).toBeInTheDocument()
  expect(screen.getByText('¡Haz tus ideas realidad!')).toBeInTheDocument()
  expect(screen.getByText('Solicitar impresión')).toBeInTheDocument()
  expect(screen.getByText('Diseños destacados')).toBeInTheDocument()
  expect(screen.getByText('Mejores artistas')).toBeInTheDocument()
  expect(screen.getByText('Impresoras a la venta')).toBeInTheDocument()
  expect(screen.getByText('Materiales a la venta')).toBeInTheDocument()
})