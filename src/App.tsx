// import { useState } from 'react';
import './css/App.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
import { MovieProvider } from './contexts/MovieContext';

function App() {
  // const [count, setCount] = useState(0);

  return (
    <MovieProvider>
      <Navbar></Navbar>
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/favorites' element={<Favorites />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
