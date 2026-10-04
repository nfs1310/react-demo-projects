import { useState } from "react";
import type Song from "../interfaces/Song";

const songs: Song[] = [
    {
        id: '1',
        title: 'Song 1',
        artist: 'Artist 1',
        album: 'N/A',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '6:12',
    },
    {
        id: '2',
        title: 'Song 2',
        artist: 'Artist 2',
        album: 'N/A',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '7:45',
    },
    {
        id: '3',
        title: 'Song 3',
        artist: 'Artist 3',
        album: 'N/A',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '8:20',
    },
    {
        id: '4',
        title: 'Song 4',
        artist: 'Artist 4',
        album: 'N/A',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '9:10',
    },
    {
        id: '5',
        title: 'Song 5',
        artist: 'Artist 5',
        album: 'N/A',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: '10:15',
    },
    {
        id: '6',
        title: 'Song 6',
        artist: 'Artist 6',
        album: 'N/A',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        duration: '11:30',
    },
];

export const useMusic = () => {
    const [allSongs, setAllSongs] = useState<Song[]>(songs);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

    const handlePlaySong = (song: Song, index: number) => {
        setCurrentSong(song);
        setCurrentSongIndex(index);
    }


    return {
        allSongs,
        handlePlaySong,
        currentSong,
        currentSongIndex,
    };
}
