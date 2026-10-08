import type Song from "../interfaces/Song";

export default interface Playlist {
    id: string;
    name: string;
    songs: Song[];
}