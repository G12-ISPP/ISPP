
const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export const register = async (data) => {
    return await fetch(backend + '/users/api/v1/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

const login = async (username, password) => {
    return fetch(backend + '/users/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
}

export const getUser = async (id) => {
    return await fetch(backend + '/users/api/v1/users/' + id + '/get_user_data/');
}