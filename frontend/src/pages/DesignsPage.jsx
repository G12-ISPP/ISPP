import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import PageTitle from '../components/PageTitle/PageTitle'

const DesignsPage = () => {
  return (
    <div>
      <PageTitle title="Diseños" />
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.DESIGN} />
    </div>
  )
}

export default DesignsPage
