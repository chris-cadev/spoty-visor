import { useVisorVideo } from './useVisorVideo';
import React, { type FC } from 'react'

interface SpotyVisorProps {
  accessToken?: string;
}

export const SpotyVisor: FC<SpotyVisorProps> = ({ accessToken }) => {
  const video = useVisorVideo(accessToken);

  if (!video) {
    return null;
  }

  return <iframe
    title={video.name}
    allow="autoplay; encrypted-media; picture-in-picture"
    width="560"
    height="315"
    src={`${video.url}?autoplay=1&mute=1&start=${video.start}`}
  />
}
