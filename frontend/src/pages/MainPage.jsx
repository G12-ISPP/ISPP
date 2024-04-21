import React, {useState} from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import Text, { TEXT_TYPES } from '../components/Text/Text'
import Button, { BUTTON_TYPES } from '../components/Button/Button'
import ArtistsGrid from '../components/ArtistsGrid/ArtistsGrid'
import {ModalChildren} from "../components/ModalChildren/ModalChildren.jsx";

const MainPage = ({
    cart,
    setCart,
  }) => {
    const [isOpen, setIsOpen] = useState(localStorage.getItem('firstTime') === null);

    function onCloseModal() {
        localStorage.setItem('firstTime', 'false');
        setIsOpen(false);
    }


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
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=D'} main={true} cart={cart} setCart={setCart} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Piezas destacadas' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=I'} main={true} cart={cart} setCart={setCart} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Mejores diseñadores' />
            </div>
            <ArtistsGrid gridType={GRID_TYPES.MAIN_PAGE} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Impresoras a la venta' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=P'} main={true} cart={cart} setCart={setCart}  />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Materiales a la venta' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=M'} main={true} cart={cart} setCart={setCart}  />

            <div className='blank-space' />

        </>
    )
}

export default MainPage