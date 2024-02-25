import React from 'react'
import './Artist.css'
import filledStar from '../../assets/bxs-star.svg'
import emptyStar from '../../assets/bx-star.svg'
import profilePic from '../../assets/design_buzz_lightyear.jpg'

const Artist = (props) => {

    const { name, pathImage, pathDetails } = props

    const onButtonClick = () => {
        if (!pathDetails) {
            window.location.href = '/';
        } else {
            window.location.href = pathDetails;
        }
    }

    return (
        <div className='artist' onClick={onButtonClick}>
            
            <div className='artist-image'>
                <img src={pathImage} className='image'/>
            </div>

            <div className='artist-description'>
                <p className='name'>{name}</p>
                {/* Sustituir por la lógica de opiniones en un futuro */}
                <div className='stars-container'>
                    <img src={filledStar} className='star' />
                    <img src={filledStar} className='star' />
                    <img src={filledStar} className='star' />
                    <img src={emptyStar} className='star' />
                    <img src={emptyStar} className='star' />
                </div>
            </div>

        </div>
    )
}

export default Artist
