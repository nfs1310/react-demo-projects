import { useEffect, useRef } from "react";
import { useMusic } from "../hooks/useMusic"


const MusicPlayer = () => {
  const { currentSong, formatTime, currentTime, duration, setDuration, 
    setCurrentTime, nextSong, prevSong, isPlaying, play, pause, volume, setVolume } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(event.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(+audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(+audio.currentTime);
    };

    const handleEnded = () => {
      nextSong();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    }
  }, [setDuration, setCurrentTime, currentSong]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

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
          style={{"--progress": `${progressPercentage}%`} as React.CSSProperties}
          onChange={handleTimeChange}
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

      <div className="volume-container">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="volume-bar"
          onChange={handleVolumeChange}
          value={volume}
        />
      </div>
    </div>
  )
}

export default MusicPlayer