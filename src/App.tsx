import { useState } from 'react';
import MovieCard from './components/MovieCard';
import type { Movie } from './interfaces/Movie';
import Home from './pages/Home';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Home></Home>
    </>
  );
}

export default App;
