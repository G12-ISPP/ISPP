const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export const getPost = (postId) => {
    return fetch(backend + '/posts/get_post_by_id/' + postId, {
        method: 'GET',
            headers: {
            'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
}