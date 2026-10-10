import type Song from "../interfaces/Song";
import type Playlist from "../interfaces/Playlist";
import type React from "react";

export default interface MusicContextValue {
    songsList: Song[];
    handlePlaySong: (song: Song, index: number) => void;
    formatStringTime: (time: string) => string;
    formatTime: (time: number) => string;
    currentSong: Song;
    currentSongIndex: number;
    currentTime: number;
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
    duration: number;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    nextSong: () => void;
    prevSong: () => void;
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
    playlists: Playlist[];
    createPlaylist: (name: string) => void;
    addSongToPlaylist: (playlistId: string, song: Song) => void;
    setCurrentSong: React.Dispatch<React.SetStateAction<Song>>;
    deletePlaylist: (name: string) => void;
}