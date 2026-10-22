import { useMovieContext } from '../contexts/MovieContext';
import '../css/MovieCard.css';
import type { Movie } from '../interfaces/Movie'

const MovieCard = ({ movie }: { movie: Movie }) => {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const isFvrt = isFavorite(movie.id);
    
    function favoriteBtnClicked (e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if(isFvrt)
            removeFromFavorites(movie.id);
        else
            addToFavorites(movie)
    }

    const getMoviePoster = (posterUrl: string) => {
        return `https://image.tmdb.org/t/p/w500${posterUrl}`;
    }

    return (
        <>
            <div className='movie-card'>
                <div className='movie-poster'>
                    <img src={getMoviePoster(movie.poster_path)} alt={movie.name} />
                    <div className='movie-overlay'>
                        <button className={`favorite-btn ${isFvrt ? 'active' : ''}`} onClick={favoriteBtnClicked}>
                            ♥
                        </button>
                    </div>
                </div>
                <div className='movie-info'>
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date?.split('-')[0]}</p>
                </div>
            </div>
        </>
    )
}

export default MovieCard