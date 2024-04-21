import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import PageTitle from '../components/PageTitle/PageTitle'

const PrintersPage = ({cart, setCart}) => {
  return (
    <div>
      <PageTitle title="Impresoras" />
      <ProductsGrid gridType={GRID_TYPES.UNLIMITED} elementType={ELEMENT_TYPES.PRINTER} cart={cart} setCart={setCart} />
    </div>
  )
}

export default PrintersPage