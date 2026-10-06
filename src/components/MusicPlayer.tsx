import { useEffect, useRef } from "react";
import { useMusic } from "../hooks/useMusic"


const MusicPlayer = () => {
  const { currentSong, formatTime, currentTime, duration, setDuration, setCurrentTime, nextSong, prevSong, isPlaying, play, pause } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(+audio.duration);
    };

    const handleTimeUpdate = () => { };

    const handleEnded = () => { };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    // audio.addEventListener("timeupdate", handleTimeUpdate);
    // audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      // audio.removeEventListener("timeupdate", handleTimeUpdate);
      // audio.removeEventListener("ended", handleEnded);
    }
  }, [setDuration, setCurrentTime, currentSong]);

  return (
    <div className="music-player">
      <audio ref={audioRef} src={currentSong.url.toString()} preload="metadata" crossOrigin="anonymous" />

      <div className="track-info">
        <h3 className="track-title">{currentSong?.title}</h3>
        <p className="track-artist">{currentSong?.artist}</p>
      </div>
      <div className="progress-container">
        <span className="time">{formatTime(+currentTime)}</span>
        <input type="range"
          className="progress-bar"
          min="0"
          max={duration || 0}
          value={currentTime || 0}
          step="0.1"
          readOnly
        // onChange={handleTimeChange}
        />
        <span className="time">{formatTime(+duration)}</span>
        {/* <span className="time">NUMBER: {formatTime(duration)}</span> */}
      </div>
      <div className="controls">
        <button className="control-btn" onClick={prevSong}>
          ⏮
        </button>
        <button
          className="control-btn play-btn"
          onClick={() => (isPlaying ? pause() : play())}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="control-btn" onClick={nextSong}>
          ⏭
        </button>
      </div>
    </div>
  )
}

export default MusicPlayer