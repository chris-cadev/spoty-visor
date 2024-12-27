import { getVideoStartSecond } from "./calculate-start";
import type { CurrentSong } from "./spotify-fetch";

export interface Video {
    id: string;
    url: string;
    duration: number;
    start?: number
    name: string;
}

export const searchVideos = (term: string, quantity: number): Promise<[Video, Video, Video]> => {
    const body = { q: encodeURIComponent(term), c: encodeURIComponent(quantity) } as any;
    return fetch(`/api/yt-search?${Object.keys(body).map((param) => `${param}=${body[param]}`).join("&")}`).then(r => r.json());
}

const songToSearchString = (song: CurrentSong) => {
    if (!song) {
        return null;
    }
    const { name, artists: { main, ft } } = song;
    // TODO: expose the search template in the UI to let the use write their own
    return `${name} - ${main}${!ft ? '' : ` ft. ${ft?.join(',')}`} Video Official`
}

export const fetchPossibleVideo = async (song: CurrentSong) => {
    const searchString = songToSearchString(song);
    if (!searchString) {
        return null;
    }
    const response = await searchVideos(searchString, 3);
    // TODO: expose the videos response in the UI to select which the user wants
    const [videoResponse] = response;
    videoResponse.start = getVideoStartSecond(videoResponse.duration, song.current, song.duration);
    return videoResponse;
}