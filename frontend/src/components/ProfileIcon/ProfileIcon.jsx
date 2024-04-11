import React, { useState, useEffect } from 'react'
import './ProfileIcon.css'
import star from '../../assets/bxs-star.svg';
import defaultProfileImage from '../../assets/avatar.svg';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const ProfileIcon = (props) => {

  const { name, onClick, showScore, userId } = props
  const [data, setData] = useState({});

  const onProfileClick = () => {
    if (onClick) {
      window.location.href = JSON.parse(frontend) + `/user-details/${onClick}`;
    }
  }

  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        let petition = backend + '/users/api/v1/users/' + userId + '/get_user_data/';
        petition = petition.replace(/"/g, '');
        const response = await fetch(petition);

        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error('Error al obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error al comunicarse con el backend:', error);
      }
    };

    if (showScore && userId) {
      const fetchOpinions = async () => {
        try {
          let petition = backend + '/opinion/api/v1/opinion/?target_user=' + userId;
          petition = petition.replace(/"/g, '');
          const response = await fetch(petition, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
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

      fetchUser();
      fetchOpinions();
    } else if (showScore && !userId) {
      console.error('Es necesario incluir el ID del usuario si se quiere mostrar la valoración.');
    }

  }, []);

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

  return (
    <div className='profile-icon-container'>
      <img className='profile-icon-image' src={data.profile_picture || defaultProfileImage} alt="profile-image" onClick={onProfileClick} />
      <p className='profile-icon-name' onClick={onProfileClick}>{name}</p>
      {showScore ?
        <div className='profile-icon-score-container'>
          {roundScore(avgScore) != 0 && <img className='profile-icon-star' src={star} alt="star" />}
          <p className='profile-icon-score'>{roundScore(avgScore) === 0 ? "(Sin valoraciones)" : roundScore(avgScore)}</p>
        </div>
        : null}
    </div>
  )
}

export default ProfileIcon
