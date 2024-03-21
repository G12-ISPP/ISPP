import { test } from 'vitest'
import { render, screen } from "@testing-library/react";
import DesignsPage from '../pages/DesignsPage'
import PiecesPage from '../pages/PiecesPage'
import PrintersPage from '../pages/PrintersPage'
import MaterialsPage from '../pages/MaterialsPage'
import ArtistsPage from '../pages/ArtistsPage'
import '@testing-library/jest-dom'

test('renderiza DesignsPage sin crashear', () => {
    render(<DesignsPage />)
  })


test('renderiza PiecesPage sin crashear', () => {
    render(<PiecesPage />)
  })

test('renderiza PrintersPage sin crashear', () => {
    render(<PrintersPage />)
  })

test('renderiza MaterialsPage sin crashear', () => {
    render(<MaterialsPage />)
  })

test('renderiza ArtistsPage sin crashear', () => {
    render(<ArtistsPage />)
  })

test('DesignsPage contiene todos los objetos', () => {
    render(<DesignsPage />)
    
    expect(screen.getByText('Diseños')).toBeInTheDocument()
  
  })

test('Pieces contiene todos los objetos', () => {
    render(<PiecesPage />)
    
    expect(screen.getByText('Piezas')).toBeInTheDocument()
  
  })

test('Printers contiene todos los objetos', () => {
    render(<PrintersPage />)
    
    expect(screen.getByText('Impresoras')).toBeInTheDocument()
  
  })

test('Materials contiene todos los objetos', () => {
    render(<MaterialsPage />)
    
    expect(screen.getByText('Materiales')).toBeInTheDocument()
  
  })

test('Artists contiene todos los objetos', () => {
    render(<ArtistsPage />)
    
    expect(screen.getByText('Artistas')).toBeInTheDocument()
  
  })