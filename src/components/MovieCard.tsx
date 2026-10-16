import React from 'react'

const MovieCard = ({ movie }: { movie: any }) => {
    console.log(movie)
    return (
        <>
            <div>${`MovieCard says "${movie}"`}</div>
            
        </>
    )
}

export default MovieCard