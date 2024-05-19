const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export const getProduct = (id) => {
    return fetch(backend + '/products/api/v1/products/' + id + '/get_product_data/');
}

export const getProducts = (seller=null) => {
    return fetch(backend + '/products/api/v1/products/').then(response => response.json());
}

export const getProductsFromSeller = (seller) => {
    return fetch(backend + '/products/api/v1/products/?seller=' + seller);
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