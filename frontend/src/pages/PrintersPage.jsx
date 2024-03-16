import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'

const PrintersPage = () => {
  return (
    <div>
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.PRINTER} />
    </div>
  )
}

export default PrintersPage