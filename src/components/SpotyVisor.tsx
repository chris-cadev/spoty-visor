
import { getCurrentPlaying } from '@modules/visualizer/spotify-fetch';
import React, { useEffect, type FC } from 'react'

interface SpotyVisorProps {
  accessToken?: string;
}

export const SpotyVisor: FC<SpotyVisorProps> = ({ accessToken }) => {
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    getCurrentPlaying(accessToken).then(currentSong => {
      const { song, artists: { main }, current, duration } = currentSong;
      console.log({ song, main, current, duration });
    });
  }, [accessToken])

  return (
    !accessToken ? <div>Not able to vizualice</div> : <div>Visor</div>
  )
}
