import { useState } from 'react';
import MovieCard from './components/MovieCard';
import type { Movie } from './interfaces/Movie';

function App() {
  const [count, setCount] = useState(0);
  const mv: Movie = {} as Movie;
  mv.name = 'NAME 1';
  mv.title = 'Name 1 Title'
  mv.url = '/'
  mv.release_date = '2026'



  return (
    <>
      <MovieCard movie={mv} />
      <section id="spacer"></section>
    </>
  );
}

export default App;
