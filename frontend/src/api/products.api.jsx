const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export const getProduct = (id) => {
    return fetch(backend + '/products/api/v1/products/' + id + '/');
}

export const getProducts = () => {

    return fetch(backend + '/products/api/v1/products/').then(response => response.json());
}

export const saveProduct = (product) => {
    return fetch(backend + '/products/api/v1/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(product)
    });
}