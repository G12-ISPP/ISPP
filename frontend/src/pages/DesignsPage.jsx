import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'

const DesignsPage = () => {
  return (
    <div>
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.DESIGN} />
    </div>
  )
}

export default DesignsPage
