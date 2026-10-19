import type { Movie } from "../interfaces/Movie";

const API_KEY: string = '8183ed633b8de63abebfb72925728315';
const BASE_URL: string = 'https://api.themoviedb.org/3';

export const getPopularMovies = async() => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    const result = data.results as Movie[];console.log('FETCH RESULT >> ', result);
    return result;
}

export const searchMovies = async(query: string) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    const result = data.results as Movie[];console.log('FETCH RESULT >> ', result);
    return result;
}