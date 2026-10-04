import { useMusic } from "../hooks/useMusic"


const MusicPlayer = () => {
  const { currentSong, formatStringTime, currentTime, duration } = useMusic();
  return (
    <div className="music-player">
      <audio />
      <div className="track-info">
        <h3 className="track-title">{currentSong?.title}</h3>
        <p className="track-artist">{currentSong?.artist}</p>
      </div>
      <div className="progress-container">
        <span className="time">{formatStringTime(currentTime.toString())}</span>
        <input type="range"
          className="progress-bar"
          min="0"
          max={duration || 0}
          value={currentTime || 0}
          step="0.1"
        />
        <span className="time">{formatStringTime(duration.toString())}</span>
      </div>
    </div>
  )
}

export default MusicPlayer