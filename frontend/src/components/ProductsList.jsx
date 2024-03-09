import React from 'react';
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'

const ProductList = () => {
    const id = window.location.href.split('/')[4];


  return (
    <ProductsGrid gridType={GRID_TYPES.PAGINATED} filter={'?seller='+id} />
  );
};

export default ProductList;
