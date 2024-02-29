import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import Text, { TEXT_TYPES } from '../components/Text/Text'
import Button, { BUTTON_TYPES } from '../components/Button/Button'
import ArtistsGrid from '../components/ArtistsGrid/ArtistsGrid'

const MainPage = () => {

    return (
        <>
            <div className="slogan">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Explora la innovación en 3D!' />
                <Text type={TEXT_TYPES.TITLE_NORMAL} text='Encuentra diseños, impresoras y materiales de alta calidad.' />
                <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Haz tus ideas realidad!' />
                <Button type={BUTTON_TYPES.LARGE} text='Solicitar impresión' path='/designs/my-design'  />
            </div>

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Diseños destacados' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} elementType={ELEMENT_TYPES.DESIGN} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Piezas destacadas' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} elementType={ELEMENT_TYPES.IMPRESSION} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Mejores artistas' />
            </div>
            <ArtistsGrid gridType={GRID_TYPES.MAIN_PAGE} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Impresoras a la venta' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} elementType={ELEMENT_TYPES.PRINTER} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Materiales a la venta' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} elementType={ELEMENT_TYPES.MATERIAL} />

            <div className='blank-space' />

        </>
    )
}

export default MainPage