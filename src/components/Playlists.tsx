import { useState } from "react";
import { useMusicContext } from "../contexts/MusicContext";


const Playlists = () => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");
  const { createPlaylist, playlists } = useMusicContext(); // Use the context to access playlists and createPlaylist function

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() !== "") {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  return (
    <div className="playlists">
      <h2>Playlists</h2>
      <div className="create-playlist">
        {/* Create playlist form will be rendered here */}
        <h3>Create New Playlist</h3>
        <div className="playlist-form">
          {/* Playlist form fields will be rendered here */}
          <input type="text" placeholder="Playlist Name" className="playlist-input"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button className="create-btn" onClick={handleCreatePlaylist}>
            Create
          </button>
        </div>
      </div>
      <div className="playlists-list">
        {/* <h3>Existing Playlists</h3> */}
        {playlists.length === 0 ? (
          <p className="empty-message">No playlists available.</p>
        ) : (
          // <ul>
          //   {playlists.map((playlist) => (
          //     <li key={playlist.id}>{playlist.name}</li>
          //   ))}
          // </ul>
          (playlists.map((playlist, key) => (
            <div key={key} className="playlist-item">
              <div className="playlist-header">
                <h3>{playlist.name} </h3>
                <div className="playlist-actions">
                  {/* Add action buttons here, e.g., delete, edit */}
                  <button className="delete-playlist-btn">Delete</button>
                </div>
              </div>
              <div className="add-song-section">
                <div className="search-container">
                  <input type="text" placeholder="Search songs to add ..." />
                </div>
              </div>
            </div>
          )))
        )}
      </div>
    </div>
  )
}

export default Playlists