
import MovieCard from '../components/MovieCard';
import { useMovieContext } from '../contexts/MovieContext';
import '../css/Favorites.css';
import type { Movie } from '../interfaces/Movie';

const Favorites = () => {
  const { favorites, removeAllFavorites } = useMovieContext();

  const handleRemoveAllFavorites = () => {
    const confirmRemoval = window.confirm('Sure you want to REMOVE ALL ITEMS ?');
    if (confirmRemoval)
      removeAllFavorites();
  }

  if (favorites.length > 0) {
    return (
      <>
        <h2 className='favorites-header'>Your Current Favorite Movies</h2>
        <button className='remove-btn' onClick={handleRemoveAllFavorites}>Remove All Favorites</button>
        <div className='movies-grid'>
          {favorites.map((movie: Movie) =>
            <MovieCard movie={movie} key={movie.id} />)}
        </div>
      </>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorites Movies Yet</h2>
      <p>Start adding movies to your favorites and they will appear here</p>
    </div>
  )
}

export default Favorites