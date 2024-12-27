import { useCallback, useEffect, useState } from "react";
import { getCurrentPlaying, type CurrentSong } from "./spotify-fetch";

const RELOAD_INTERVAL_MS = 3 * 1000;

export const useCurrentSong = (accessToken?: string) => {
    const [song, setSong] = useState<null | CurrentSong>(null);

    const fetchCurrentSong = useCallback(async () => {
        if (!accessToken || accessToken.trim() === "") {
            console.warn("Access token is missing or invalid.");
            return;
        }

        try {
            const songResponse = await getCurrentPlaying(accessToken);

            // Update only if the song is different
            if (songResponse && songResponse.id !== song?.id) {
                setSong(songResponse);
            }
        } catch (error) {
            console.error("Error fetching current song:", error);
        }
    }, [accessToken, song?.id]);

    useEffect(() => {
        if (!accessToken || !song) {
            fetchCurrentSong();
            return;
        }

        const intervalId = setInterval(() => {
            fetchCurrentSong();
        }, RELOAD_INTERVAL_MS);

        const timeoutId = setTimeout(() => {
            fetchCurrentSong();
        }, Math.max(0, song.duration - song.current));

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [accessToken, fetchCurrentSong, song?.duration, song?.current]);

    return song;
};
