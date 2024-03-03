import React, { useEffect, useState } from 'react'
import './ArtistsGrid.css'
import Artist from '../Artist/Artist';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const ArtistsGrid = (consts) => {

    const { gridType } = consts

    const getGridClass = () => {
        return gridType.toLowerCase() + '-gr grid';
    }

    const getAllArtists = async () => {
        try {
            let petition = backend + '/users/api/v1/users/';
            petition = petition.replace(/"/g, '')
            const response = await fetch(petition, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Error al obtener los artistas');
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
        }
    }

    const [artists, setArtists] = useState([]);

    useEffect(() => {

        async function loadArtists() {
            const res = await getAllArtists();

            if (res && Array.isArray(res)) { // Verificar si res no es undefined y es un array
                {/*Adaptar código cuando se añada funcionalidad de destacados*/}
                if (gridType === GRID_TYPES.MAIN_PAGE) {
                    setArtists(res.slice(0, 5));
                } else {
                    setArtists(res);
                }
            }
        }
        loadArtists();

    }, [])

    return (
        <div className={getGridClass()}>
            {artists.map(artist => (
                <div key={artist.id}>
                    <Artist username={artist.username} pathImage='' pathDetails={artist.id} />
                </div>
            ))}
        </div>
    )
}

export default ArtistsGrid

export const GRID_TYPES = {
    MAIN_PAGE: 'MAIN-PAGE',
    UNLIMITED: 'UNLIMITED',
    PAGINATED: 'PAGINATED',
}
