import { useCallback, useEffect, useState } from "react";
import { fetchPossibleVideo, type Video } from "./youtube-search";
import { useCurrentSong } from "./useCurrentSong";

export const useVisorVideo = (accessToken?: string) => {
    const [video, setVideo] = useState<null | Video>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const song = useCurrentSong(accessToken);

    const handlePlayingSong = useCallback(async () => {
        if (!song) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const videoResponse = await fetchPossibleVideo(song);
            if (videoResponse && videoResponse.id !== video?.id) {
                setVideo(videoResponse);
            }
        } catch (err) {
            console.error("Error fetching video:", err);
            setError("Failed to fetch video. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [song, video?.id]);

    useEffect(() => {
        handlePlayingSong();
    }, [handlePlayingSong]);

    return { video, error, loading };
};
