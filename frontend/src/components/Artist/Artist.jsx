
import './Artist.css'
import filledStar from '../../assets/bxs-star.svg'
import emptyStar from '../../assets/bx-star.svg'
import defaultImage from '../../assets/default_artist_image.png'
import React, { useState, useEffect } from 'react';


const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const Artist = (props) => {
    const backend = import.meta.env.VITE_APP_BACKEND;

    const [avgScore, setAvgScore] = useState(0);
    const [opinionsLength, setOptionsLength] = useState(0);

    const { username, pathImage, pathDetails } = props

    const onButtonClick = () => {
        if (!pathDetails) {
            window.location.href = '/';
        } else {
            window.location.href = JSON.parse(frontend) + `/user-details/${pathDetails}`;
        }
    }

    function modifyImagePath(pathImage) {
        let imagePath = defaultImage;

        if (pathImage) {
            imagePath = 'images/' + pathImage;
        }

        return imagePath;
    }
    const imageRoute = modifyImagePath(pathImage);

    function roundScore(score) {
        const roundedValue = Math.round(score);
    
        if (roundedValue < 0) {
          return 0;
        } else if (roundedValue > 5) {
          return 5;
        } else {
          return roundedValue;
        }
      }


    const fetchOpinions = async () => {
        try {
          let petition = backend + '/opinion/api/v1/opinion/?target_user=' + pathDetails;
          petition = petition.replace(/"/g, '');
          const response = await fetch(petition, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (response.ok) {
            const data = await response.json();
  

            setOptionsLength(data.length);

            const totalScore = data.reduce((acc, opinion) => acc + opinion.score, 0);
            const avgScore = data.length > 0 ? totalScore / data.length : 0;
            setAvgScore(avgScore);
  
          } else {
            console.error('Error al obtener las opiniones');
          }
        } catch (error) {
          console.error('Error al comunicarse con el backend:', error);
        }
      };

      useEffect(() => {
        fetchOpinions();
    }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente

      

      return (
        <div className='artist' onClick={onButtonClick}>
            
            <div className='artist-image'>
                <img src={pathImage || defaultImage} className='image'/>
            </div>
    
            <div className='artist-description'>
                <p className='name'>{username}</p>
                {opinionsLength > 0 ? (
                    <div className="user-review">
                        <div className="user-review-stars">
                            {Array.from({ length: roundScore(avgScore) }, (_, index) => (
                                <img key={index} src={filledStar} alt="filled star" />
                            ))}
                            {Array.from({ length: 5 - roundScore(avgScore) }, (_, index) => (
                                <img key={index} src={emptyStar} alt="empty star" />
                            ))}
                        </div>
                        
                    </div>
                ) : (
                    <p className='user-review-text'>Sin valoraciones</p>
                )}
            </div>
    
        </div>
    );
}

export default Artist
