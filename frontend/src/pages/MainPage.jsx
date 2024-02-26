import React from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import Text, { TEXT_TYPES } from '../components/Text/Text'
import Artist from '../components/Artist/Artist'

const MainPage = () => {

    return (
        <>
            <div className="slogan">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Explora la innovación en 3D!' />
                <Text type={TEXT_TYPES.TITLE_NORMAL} text='Encuentra diseños, impresoras y materiales de alta calidad.' />
                <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Haz tus ideas realidad!' />
            </div>

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Diseños destacados' />
            </div>

            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} elementType={ELEMENT_TYPES.DESIGN} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Mejores artistas' />
            </div>

            {/* Sustituir luego por la lógica para artistas una vez se puedan hacer peticiones al backend para los usuarios */}
            <div className="artists-gr grid">
                <Artist name='Nombre artista' pathDetails='/' />
                <Artist name='Nombre artista' pathDetails='/' />
                <Artist name='Nombre artista' pathDetails='/' />
                <Artist name='Nombre artista' pathDetails='/' />
                <Artist name='Nombre artista' pathDetails='/' />
            </div>

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
