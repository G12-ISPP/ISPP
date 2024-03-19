import React, { useState, useEffect } from 'react';
import './Opinion.css';
import filledStar from '../assets/bxs-star.svg'
import emptyStar from '../assets/bx-star.svg'

const Opinion = ({ opinion }) => {
  const [user, setUser] = useState(null);
  const filledStars = Math.round(opinion.score);
  const emptyStars = 5 - filledStars;

  const filledStarsArray = Array.from({ length: filledStars }, (_, index) => (
    <img key={index} src={filledStar} className='star' alt='filled star' />
  ));

  const emptyStarsArray = Array.from({ length: emptyStars }, (_, index) => (
    <img key={filledStars + index} src={emptyStar} className='star' alt='empty star' />
  ));

  useEffect(() => {
    const backend = import.meta.env.VITE_APP_BACKEND;

    const fetchUserData = async () => {
      try {
        const petition = `${backend}/users/api/v1/users/${opinion.author}/get_user_data/`;
        const response = await fetch(petition);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [opinion]);

  return (
    <div className="opinion">
      <div className="opinion-header">
        <span className="opinion-author">{user && user.username}</span>
        <div className="opinion-stars">
          {filledStarsArray}
          {emptyStarsArray}
        </div>
      </div>
      <p className='opinion-desc'>{opinion.description}</p>
      <p className="opinion-date">{opinion.date}</p>
    </div>
  );
};

export default Opinion;
