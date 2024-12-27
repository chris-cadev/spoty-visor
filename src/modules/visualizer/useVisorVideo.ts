import { useEffect, useState } from "react";
import { getVideoStartSecond } from "./calculate-start";
import { getCurrentPlaying, type CurrentSong } from "./spotify-fetch";
import { searchVideos, type Video } from "./youtube-search";

const RELOAD_INTERVAL_SECONDS = 5;
const RELOAD_INTERVAL_MS = RELOAD_INTERVAL_SECONDS * 1000;

export const useVisorVideo = (accessToken?: string) => {
    const [video, setVideo] = useState<null | Video>(null);
    const [song, setSong] = useState<null | CurrentSong>(null);


    const songToSearchString = (song: CurrentSong) => {
        const { name, artists: { main, ft } } = song;
        return `${name} - ${main}${!ft ? '' : ` ft. ${ft?.join(',')}`}`
    }

    const fetchPossibleVideos = async (song: CurrentSong) => {
        const searchString = songToSearchString(song);
        const response = await searchVideos(searchString, 3);
        const [videoResponse] = response;
        videoResponse.start = getVideoStartSecond(videoResponse.duration, song.current, song.duration);
        return videoResponse;
    }
    useEffect(() => {
        if (!accessToken?.trim()) {
            return;
        }
        const reloadInterval = setInterval(async () => {
            console.log('hello request')
            const responseSong = await getCurrentPlaying(accessToken);
            if (song && responseSong.id === song.id) {
                return;
            }
            setSong(responseSong);
            const videoResponse = await fetchPossibleVideos(responseSong);
            setVideo(videoResponse);
        }, RELOAD_INTERVAL_MS);

        return () => {
            clearInterval(reloadInterval);
        }
    });

    return video;
}