import React, { useEffect, useState } from 'react';
import Product from './Product/Product';
import Artist from './Artist/Artist';
import Text, { TEXT_TYPES } from '../components/Text/Text';

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Recupera los datos del localStorage
        const storedData = localStorage.getItem('searchResults');
        const storedText = localStorage.getItem('searchText');
        console.log(storedData)
        if (storedData) {
            setSearchResults(JSON.parse(storedData));
            setSearchText(storedText);
            // Limpia los datos del localStorage después de leerlos
            localStorage.removeItem('searchResults');
            localStorage.removeItem('searchText');
        }
    }, []);

    return (
        <>
            <h1 className='title'>Resultado de la búsqueda:</h1>
            {searchText && (
                <h2 className='title'>"{searchText}"</h2>
            )}

            {!searchText && (
                <h2 className='title'>¡Realice una búsqueda!</h2>
            )}
            {searchResults && (
                <>
                    {searchResults.productsData && searchResults.productsData.length > 0 && (
                        <div>
                            <div className='slogan'>
                                <Text type={TEXT_TYPES.TITLE_BOLD} text='Productos' />
                            </div>
                            <div className='product-list'>
                                {searchResults.productsData.map(product => (
                                    <Product
                                        key={product.id}
                                        name={product.name}
                                        price={product.price}
                                        pathImage={product.image_url ? product.image_url : product.imageRoute}
                                        pathDetails={product.id}
                                        isImageRoute={!product.image_url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {searchResults.usersData && searchResults.usersData.length > 0 && (
                        <div>
                            <div className='slogan'>
                                <Text type={TEXT_TYPES.TITLE_BOLD} text='Usuarios' />
                            </div>
                            <div className='artist-list'>
                                {searchResults.usersData.map(user => (
                                    <Artist
                                        key={user.id}
                                        username={user.username}
                                        pathImage={''}
                                        pathDetails={user.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {searchResults.productsData.length === 0 && searchResults.usersData.length === 0 && (
                        <h3 className='title'>No existen resultados para su búsqueda.</h3>
                    )}
                </>
            )}
        </>
    );
};

export default SearchResultsPage;
