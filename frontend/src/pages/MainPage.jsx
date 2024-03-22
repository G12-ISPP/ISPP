import React, {useState} from 'react'
import ProductsGrid, { ELEMENT_TYPES, GRID_TYPES } from '../components/ProductsGrid/ProductsGrid'
import Text, { TEXT_TYPES } from '../components/Text/Text'
import Button, { BUTTON_TYPES } from '../components/Button/Button'
import ArtistsGrid from '../components/ArtistsGrid/ArtistsGrid'
import {ModalChildren} from "../components/ModalChildren/ModalChildren.jsx";

const MainPage = () => {
    const [isOpen, setIsOpen] = useState(localStorage.getItem('firstTime') === null);

    function onCloseModal() {
        localStorage.setItem('firstTime', 'false');
        setIsOpen(false);
    }


    return (
        <>
            <ModalChildren isOpen={isOpen} onClose={onCloseModal}>
                <div>
                    <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Bienvenido a SHAR3D!' />
                    <Text type={TEXT_TYPES.TITLE_NORMAL} text='Nuestro objetivo es conectar a diseñadores, impresores y entusiastas de la impresión 3D para que puedan compartir, comprar y vender diseños, impresoras y materiales de alta calidad.' />
                </div>
            </ModalChildren>
            <div className="slogan">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Explora la innovación en 3D!' />
                <Text type={TEXT_TYPES.TITLE_NORMAL} text='Encuentra diseños, impresoras y materiales de alta calidad.' />
                <Text type={TEXT_TYPES.TITLE_BOLD} text='¡Haz tus ideas realidad!' />
            </div>

            <div className="slogan">
                <Text type={TEXT_TYPES.TITLE_NORMAL} text='¿Tienes un modelo en formato STL que quieras imprimir?' />
                <Button type={BUTTON_TYPES.LARGE} text='Solicitar impresión' path='/designs/my-design'  />
                {localStorage.getItem('token')? <Button type={BUTTON_TYPES.LARGE} text='Comprar plan' path='/buy-plan' /> : null}
            </div>

            <div className="slogan">
                <Text type={TEXT_TYPES.TITLE_NORMAL} text='¿No puedes imprimirlo porque tu diseño no es STL?' />
                <Button type={BUTTON_TYPES.LARGE} text='Convertir a STL' path='/convert-to-stl'  />
            </div>

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Diseños destacados' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=D'} main={true} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Piezas destacadas' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=I'} main={true} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Mejores artistas' />
            </div>
            <ArtistsGrid gridType={GRID_TYPES.MAIN_PAGE} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Impresoras a la venta' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=P'} main={true} />

            <div className="section-title">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Materiales a la venta' />
            </div>
            <ProductsGrid gridType={GRID_TYPES.MAIN_PAGE} filter={'?product_type=M'} main={true} />

            <div className='blank-space' />

        </>
    )
}

export default MainPage