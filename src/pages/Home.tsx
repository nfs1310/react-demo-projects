import '../css/Home.css';
import React, { useState } from 'react'
import type { Movie } from '../interfaces/Movie'
import MovieCard from '../components/MovieCard';

const Home = () => {

    const [searchQuery, setSearchQuery] = useState<string>('');

    const movies: Movie[] = [
        { id: 1, title: 'John Wick', release_date: '2024', url: '', name: '' },
        { id: 2, title: 'Iron Man', release_date: '2008', url: '', name: '' },
        { id: 3, title: 'Captain America', release_date: '2011', url: '', name: '' }
    ];

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