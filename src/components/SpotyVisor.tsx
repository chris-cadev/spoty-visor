
import { getCurrentPlaying } from '@modules/visualizer/spotify-fetch';
import { searchVideos } from '@modules/visualizer/youtube-search';
import React, { useEffect, useState, type FC } from 'react'

interface SpotyVisorProps {
  accessToken?: string;
}

export const SpotyVisor: FC<SpotyVisorProps> = ({ accessToken }) => {
  const [video, setVideo] = useState<null | { url: string, thumbnail: string }>(null);
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    getCurrentPlaying(accessToken).then(async currentSong => {
      const { song, artists: { main, ft } } = currentSong;
      const results = await searchVideos(`${song} - ${main}${!ft ? '' : ` ft. ${ft?.join(',')}`}`, 3);
      setVideo(results[1]);
    });
  }, [accessToken])

  if (!video) {
    return null;
  }

  return <iframe
    src={`${video.url}?autoplay=1&mute=1`}
    frameborder="0"
    allowfullscreen
    allow="autoplay; encrypted-media"
    width="560"
    height="315"
  />
}
