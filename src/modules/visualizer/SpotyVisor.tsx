
import { getVideoStartSecond } from './calculate-start';
import { getCurrentPlaying } from './spotify-fetch';
import { searchVideos } from './youtube-search';
import React, { useEffect, useState, type FC } from 'react'

interface SpotyVisorProps {
  accessToken?: string;
}

export const SpotyVisor: FC<SpotyVisorProps> = ({ accessToken }) => {
  const [video, setVideo] = useState<null | { url: string, start: number }>(null);
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    getCurrentPlaying(accessToken).then(async song => {
      const { name, artists: { main, ft }, current, duration } = song;
      const results = await searchVideos(`${name} - ${main}${!ft ? '' : ` ft. ${ft?.join(',')}`}`, 3);
      const [video] = results;
      setVideo({ url: video.url, start: getVideoStartSecond(video.duration, current, duration) });
    });
  }, [accessToken])

  if (!video) {
    return null;
  }

  return <iframe
    allow="autoplay; encrypted-media; picture-in-picture"
    width="560"
    height="315"
    src={`${video.url}?autoplay=1&mute=1&start=${video.start}`}
  />
}
