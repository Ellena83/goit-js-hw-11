import axios from 'axios';

export default async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/';
    const key = '30765858-fc152abb5827d9103dadc3f2f';
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

    return await axios.get(`${url}${filter}`).then(response => response.data)
        .catch(function (error) {
            console.log(error.toJSON());
        });;
}