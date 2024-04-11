const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export function savePost(post) {
    const formData = new FormData();
    formData.append('name', post.name);
    formData.append('description', post.description);
    formData.append('file', post.file); // Assuming post.image is the file object

    return fetch(backend + '/posts/add-post', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
    });
}