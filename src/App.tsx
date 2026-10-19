// import { useState } from 'react';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
import from './css/App.css'

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div>
      <Navbar></Navbar>
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/favorites' element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
