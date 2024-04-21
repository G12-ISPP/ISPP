import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import PageTitle from '../components/PageTitle/PageTitle'

const DesignsPage = ({cart, setCart}) => {
  return (
    <div>
      <PageTitle title="Diseños" />
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.DESIGN} cart={cart} setCart={setCart} />
    </div>
  )
}

export default DesignsPage
