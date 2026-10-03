import MusicPlayer from "./components/MusicPlayer";


function App() {

  return (
    <div className="app">

      <main className="app-main">
        <div className="player-section">
          <MusicPlayer />
        </div>
        <div className="content-section"></div>        
      </main>

    </div>
  );
}

export default App;
