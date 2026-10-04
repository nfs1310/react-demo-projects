import { BrowserRouter, Route, Routes } from "react-router";
import MusicPlayer from "./components/MusicPlayer";
import AllSongs from "./components/AllSongs";
import Playlists from "./components/Playlists";


function App() {

  return (
    <BrowserRouter>
      <div className="app">

        <main className="app-main">
          <div className="player-section">
            <MusicPlayer />
          </div>
          <div className="content-section">
            <Routes>
              <Route path="/" element={<AllSongs />} />
              <Route path="/playlists" element={<Playlists />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
