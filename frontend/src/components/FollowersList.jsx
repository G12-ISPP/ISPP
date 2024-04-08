import React, { useEffect, useState } from 'react';
import './FollowingList.css';
import Artist from './Artist/Artist';
import Paginator from './Paginator/Paginator';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

const FollowersList = () => {
    const [followers, setFollowers] = useState([]);
    const [page, setPage] = useState(1);
    const userId = window.location.href.split('/')[4];
    const [followersPerPage, setFollowersPerPage] = useState(5);
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const petition = `${backend}/users/api/v1/users/${userId}/followers/`;
                const response = await fetch(petition, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch followers list');
                }
                const data = await response.json();
                setFollowers(data.followers);
            } catch (error) {
                console.error('Error fetching followers list:', error);
            }
        };

        fetchFollowers();
    }, [userId, followersPerPage]);

    useEffect(() => {
        setNumPages(Math.ceil(followers.length / followersPerPage) || 1);
    }, [followers, followersPerPage]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const startIndex = (page - 1) * followersPerPage;
    const paginatedFollowers = followers.slice(startIndex, startIndex + followersPerPage);

    return (
        <div className="following-list">
            <div className="following-item">
                {paginatedFollowers.map((user, index) => {
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
    );  
};

export default FollowersList;
