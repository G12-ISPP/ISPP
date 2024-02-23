export const getSomeProduct = (id) => {
    return fetch(`http://localhost:8000/products/api/v1/products/${id}/get_product_data/`)
        .then((response) => response.json());
};