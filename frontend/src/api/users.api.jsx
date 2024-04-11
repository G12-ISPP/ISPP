
const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export const register = (data) => {
    return fetch(backend + '/users/api/v1/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const login = (username, password) => {
    return fetch(backend + '/users/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
}

export const getUser = (id) => {
    return fetch(backend + '/users/api/v1/users/' + id + '/get_user_data/');
}

export const getFollowStatus = (userId) => {
    return fetch(backend + '/users/api/v1/follow/' + userId + '/status/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
}

export const toggleFollow = (userId) => {
    return fetch(backend + '/users/api/v1/follow/' + userId + '/toggle/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
}
