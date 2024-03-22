import React, { useEffect, useState } from 'react'
import './ArtistsGrid.css'
import Artist from '../Artist/Artist';
import Text, { TEXT_TYPES } from '../Text/Text';
import Paginator from '../Paginator/Paginator';

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
                const designers = data.filter(artist => artist.is_designer === true && artist.designer_plan === true);
                return designers;
            } else {
                console.error('Error al obtener los artistas');
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
        }
    }

    const groupArtists = (artists) => {
        try {

            const groupsOfArtists = artists.reduce((acc, artist, index) => {
                let groupIndex = Math.floor(index / 5);
                if (window.innerWidth > 767 && window.innerWidth < 1024) {
                    groupIndex = Math.floor(index / 3);
                } else if (window.innerWidth < 768) {
                    groupIndex = Math.floor(index / 2);
                }
                if (!acc[groupIndex]) {
                    acc[groupIndex] = [];
                }
                acc[groupIndex].push(artist);
                return acc;
            }, []);

            return groupsOfArtists;

        } catch (error) {
            console.error('Error al obtener y agrupar los artistas: ', error);
            return [];
        }
    }

    const [artists, setArtists] = useState([]);
    const [page, setPage] = useState(1);
    const [artistsPerPage, setArtistsPerPage] = useState(25);
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {

        async function loadArtists() {
            const res = await getAllArtists();

            if (res && Array.isArray(res)) { // Verificar si res no es undefined y es un array
                {/*Adaptar código cuando se añada funcionalidad de destacados*/}
                if (gridType === GRID_TYPES.MAIN_PAGE) {
                    setArtists(res.slice(0, 5));
                } else {
                    if (window.innerWidth < 768) {
                        setArtistsPerPage(12);
                    } else if (window.innerWidth > 767 && window.innerWidth < 1024) {
                        setArtistsPerPage(15);
                    }
                    const numPages = Math.ceil(res.length / artistsPerPage);
                    setNumPages(numPages);
                    const allArtists = res.slice((page - 1) * artistsPerPage, page * artistsPerPage);
                    const groupsOfArtists = groupArtists(allArtists);
                    setArtists(groupsOfArtists);
                }
            }
        }
        loadArtists();

    }, [gridType, page, artistsPerPage]);

    return (
        <div className={getGridClass()}>
            {gridType === GRID_TYPES.UNLIMITED ? (
                <div className='artists-container'>
                    <Text type={TEXT_TYPES.TITLE_BOLD} text='Artistas' />
                    {artists.map((group, groupIndex) => (
                        <div key={groupIndex} className={`artists-row ${group.length < 5 ? 'last' : ''}`}>
                            {group.map((artist, artistIndex) => (
                                <Artist username={artist.username} pathImage={artist.image_url ? artist.image_url: ''} pathDetails={artist.id} key={`artist-${groupIndex}-${artistIndex}`} />
                            ))}
                        </div>
                    ))}
                    <Paginator page={page} setPage={setPage} numPages={numPages} />
                </div>
            ) : (
                artists.map(artist => (
                    <div key={artist.id}>
                        <Artist username={artist.username} pathImage={artist.image_url ? artist.image_url : ''} pathDetails={artist.id} />
                    </div>
                ))
            )}
        </div>
    )
}

export default ArtistsGrid

export const GRID_TYPES = {
    MAIN_PAGE: 'MAIN-PAGE',
    UNLIMITED: 'UNLIMITED',
    PAGINATED: 'PAGINATED',
}