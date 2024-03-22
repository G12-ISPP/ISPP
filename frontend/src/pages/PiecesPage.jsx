import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import PageTitle from '../components/PageTitle/PageTitle'

const PiecesPage = () => {
  return (
    <div>
      <PageTitle title="Piezas" />
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.IMPRESSION} />
    </div>
  )
}

export default PiecesPage