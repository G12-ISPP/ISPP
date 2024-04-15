import React, { useEffect, useState } from 'react';
import './FollowingList.css';
import Artist from './Artist/Artist';
import Paginator from './Paginator/Paginator';
import Text, { TEXT_TYPES } from "./Text/Text";
import PageTitle from './PageTitle/PageTitle';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

const FollowingList = () => {
    const [following, setFollowing] = useState([]);
    const [page, setPage] = useState(1);
    const userId = localStorage.getItem('userId');
    const [followingPerPage, setFollowingPerPage] = useState(5);
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const petition = `${backend}/users/api/v1/users/${userId}/following/`;
                const response = await fetch(petition, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch following list');
                }
                const data = await response.json();
                setFollowing(data.followings);
            } catch (error) {
                console.error('Error fetching following list:', error);
            }
        };

        fetchFollowing();
    }, [userId, followingPerPage]);

    useEffect(() => {
        setNumPages(Math.ceil(following.length / followingPerPage) || 1);
    }, [following, followingPerPage]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const startIndex = (page - 1) * followingPerPage;
    const paginatedFollowing = following.slice(startIndex, startIndex + followingPerPage);

    return (
        <>
            <PageTitle title="Seguidos" />
            <div className="artist-title-container">
                <Text type={TEXT_TYPES.TITLE_BOLD} text='Seguidos' />
            </div>
            <div className="following-list">
                <div className="following-item">
                    {paginatedFollowing.map((user, index) => {
                        return (                     
                            <Artist 
                                username={user.username} 
                                pathImage={user.profile_picture ? `${backend}${user.profile_picture}` : ''}
                                pathDetails={user.id}
                                key={index}
                            />   
                        );
                    })}
                </div>
                <Paginator page={page} setPage={handlePageChange} numPages={numPages} />
            </div>
        </>
    );  
};

export default FollowingList;
