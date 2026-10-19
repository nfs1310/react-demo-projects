import '../css/MovieCard.css';
import type { Movie } from '../interfaces/Movie'

const MovieCard = ({ movie }: { movie: Movie }) => {
    console.log(movie)
    function favoriteBtnClicked() {
        alert('Favorite Button Clicked')
    }

    return (
        <>
            <div className='movie-card'>
                <div className='movie-poster'>
                    <img src={movie.url} alt={movie.name} />
                    <div className='movie-overlay'>
                        <button className='favorite-btn' onClick={favoriteBtnClicked}>
                            ♥
                        </button>
                    </div>
                </div>
                <div className='movie-info'>
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date}</p>
                </div>
            </div>            
        </>
    )
}

export default MovieCard