import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'

const PiecesPage = () => {
  return (
    <div>
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.IMPRESSION} />
    </div>
  )
}

export default PiecesPage