import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import PageTitle from '../components/PageTitle/PageTitle'

const MaterialsPage = ({cart, setCart}) => {
  return (
    <div>
      <PageTitle title="Materiales" />
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.MATERIAL} cart={cart} setCart={setCart} />
    </div>
  )
}

export default MaterialsPage