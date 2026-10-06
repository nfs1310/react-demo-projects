import { useState } from "react";
import type Song from "../interfaces/Song";

const songs: Song[] = [
    {
        id: '1',
        title: 'Song 1',
        artist: 'Artist 1',
        album: 'N/A',
        url: '/songs/egyptian.mp3',
        duration: '0:29',
    },
    {
        id: '2',
        title: 'Song 2',
        artist: 'Artist 2',
        album: 'N/A',
        url: '/songs/paap.mp3',
        duration: '7:45',
    },
    // {
    //     id: '3',
    //     title: 'Song 3',
    //     artist: 'Artist 3',
    //     album: 'N/A',
    //     url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    //     duration: '8:20',
    // },
    // {
    //     id: '4',
    //     title: 'Song 4',
    //     artist: 'Artist 4',
    //     album: 'N/A',
    //     url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    //     duration: '9:10',
    // },
    // {
    //     id: '5',
    //     title: 'Song 5',
    //     artist: 'Artist 5',
    //     album: 'N/A',
    //     url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    //     duration: '10:15',
    // },
    // {
    //     id: '6',
    //     title: 'Song 6',
    //     artist: 'Artist 6',
    //     album: 'N/A',
    //     url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    //     duration: '11:30',
    // },
];

export const useMusic = () => {
    const [allSongs, setAllSongs] = useState<Song[]>(songs);
    const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);

    const handlePlaySong = (song: Song, index: number) => {
        setCurrentSong(song);
        setCurrentSongIndex(index);
    }

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const formatStringTime = (time: string): string => {
        console.log('formatStringTime', time);
        if (+time === 0 || time === undefined) return '0:00';
        const timeArray = time.split(':');
        const minutes = timeArray[0] || '0';
        const seconds = timeArray[1] || '0';
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        // const minutes = Math.floor(parseInt(time) / 60);
        // const seconds = Math.floor(parseInt(time) % 60);
        // return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const nextSong = () => {
        setCurrentSongIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % allSongs.length;
            setCurrentSong(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(false); // Pause the current song when moving to the next song
    }

    const prevSong = () => {
        setCurrentSongIndex((prevIndex) => {
            const nextIndex = prevIndex === 0 ? allSongs.length - 1 : prevIndex - 1;
            setCurrentSong(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(false); // Pause the current song when moving to the previous song
    }

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);


    return {
        allSongs,
        handlePlaySong,
        formatStringTime,
        formatTime,
        currentSong,
        currentSongIndex,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        nextSong,
        prevSong,
        isPlaying,
        play,
        pause,
        volume,
        setVolume,
    };
}
