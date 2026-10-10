import { useState } from 'react';
import { useMusicContext } from '../contexts/MusicContext';
import type Song from '../interfaces/Song';
import type Playlist from '../interfaces/Playlist';

const Playlists = () => {
  const { createPlaylist, playlists, songsList, addSongToPlaylist, currentSongIndex, setCurrentSong, handlePlaySong, deletePlaylist } = useMusicContext();
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const filteredSongs = songsList.filter((song: Song) => {
    const matches =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const isAlreadyInPlaylist = selectedPlaylist?.songs.some((playlistSong) => playlistSong.id === song.id);

    return matches && !isAlreadyInPlaylist;
  });

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() !== '') {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  const handleAddSong = (song: Song) => {
    if (selectedPlaylist) {
      addSongToPlaylist(selectedPlaylist.id, song);
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  const hanldlePlayFromPlaylist = (song: Song) => {
    const globalSongIndex = songsList.findIndex(s => s.id === song.id);
    handlePlaySong(song, globalSongIndex);
  };

  const deletePlaylistConfirmation = (playlist: Playlist) => {
    if(window.confirm((`Confirm deletion of "${playlist.name}?"`))){
      deletePlaylist(playlist.id);
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
          <input
            type="text"
            placeholder="Playlist Name"
            className="playlist-input"
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
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-item">
              <div className="playlist-header">
                <h3>{playlist.name} </h3>
                <div className="playlist-actions">
                  {/* Add action buttons here, e.g., delete, edit */}
                  <button className="delete-playlist-btn" onClick={() => deletePlaylistConfirmation(playlist)}>Delete</button>
                </div>
              </div>
              <div className="add-song-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search songs to add ..."
                    value={selectedPlaylist?.id === playlist.id ? searchQuery : ''}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedPlaylist(playlist);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    onFocus={(e) => {
                      setSelectedPlaylist(playlist);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    className="show-search-input"
                  />

                  {selectedPlaylist?.id === playlist.id && showDropdown && (
                    <div className="song-dropdown">
                      {filteredSongs.length === 0
                        ? <div className='dropdown-item no-resultes'>No Songs Found !!</div>
                        : filteredSongs.map((song, key) => (
                          <div key={key} className="dropdown-item"
                            onClick={() => handleAddSong(song)}>
                            <span className='song-title'>{song.title}</span>
                            <span className='song-artist'>{song.artist}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <div className='playlist-songs'>
                {
                  playlist.songs.length === 0
                    ? (<div className='empty-playlist'> NO SONGS IN THE PLAYLIST !!</div>)
                    : (playlist.songs.map((song, key) => (
                      <div key={key} className={`playlist-song ${currentSongIndex === songsList.findIndex(s => s.id === song.id)
                        ? 'active'
                        : ''}`} onClick={() => hanldlePlayFromPlaylist(song)}>
                        <div className='song-info'>
                          <span className='song-title'>{song.title}</span>
                          <span className='song-artist'>{song.artist}</span>
                        </div>
                        <span className='song-duration'>{song.duration}</span>
                      </div>
                    )
                    ))
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;
