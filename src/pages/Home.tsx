import '../css/Home.css';
import React, { useEffect, useState } from 'react'
import type { Movie } from '../interfaces/Movie'
import MovieCard from '../components/MovieCard';
import { getPopularMovies } from '../services/api';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadPopularMovies();
    }, []);

    const loadPopularMovies = async () => {
        try {
            setLoading(true);
            const popularMovies = getPopularMovies();
            setMovies(await popularMovies)
        }
        catch (err) {
            setError('Error while fetching popular movies')
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    const handleMovieSearch: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault;
        alert(searchQuery);
        setSearchQuery('');
    }

    function updateSearchQuery(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value);
        console.log(searchQuery);
    }

    return (
        <div className='home'>
            <form onSubmit={handleMovieSearch} className='search-form'>
                <input type='text' placeholder='Search for movies ...' className='search-input' value={searchQuery} onChange={updateSearchQuery} />
                <button className='search-button' type='submit'>Search</button>
            </form>
            <div className='movies-grid'>
                {movies.map((movie) =>
                    movie.title.toLowerCase().includes(searchQuery) &&
                    <MovieCard movie={movie} key={movie.id} />)}
            </div>
        </div>
    )
}

export default Home