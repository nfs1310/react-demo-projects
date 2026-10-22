import '../css/Home.css';
import React, { useEffect, useState } from 'react'
import type { Movie } from '../interfaces/Movie'
import MovieCard from '../components/MovieCard';
import { getPopularMovies, searchMovies } from '../services/api';

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

    const handleMovieSearch: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim())
            return;
        if (loading)
            return;

        setLoading(true);

        try {
            const searcResult = await searchMovies(searchQuery);
            setMovies(searcResult);
            setError('');
        } catch (err) {
            setError('Faild to sear movie ...');
            console.log('Faild to sear movie ...');

        } finally {
            setLoading(false)
        }

        // setSearchQuery('');
    }

    function updateSearchQuery(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value);
    }

    return (
        <div className='home'>
            <form onSubmit={handleMovieSearch} className='search-form'>
                <input type='text' placeholder='Search for movies ...' className='search-input' value={searchQuery} onChange={updateSearchQuery} />
                <button className='search-button' type='submit'>Search</button>
            </form>
            {error && <p className='error-message'>{error}</p>}
            <div className='movies-grid'>
                {movies.map((movie: Movie) =>
                    movie.title.toLowerCase().includes(searchQuery) &&
                    <MovieCard movie={movie} key={movie.id} />)}
            </div>
        </div>
    )
}

export default Home