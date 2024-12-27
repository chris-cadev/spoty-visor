
export const getVideoStartSecond = (videoDuration: number, songCurrentMillisecond: number, songDuration: number) => {
    // TODO: Implement SponsorBlock API from yt-dlp to detect if there is filler
    const isVideoLargerThanSong = songDuration < videoDuration;
    const difference = Math.abs(videoDuration - songDuration);
    if (isVideoLargerThanSong) {
        return Math.ceil((songCurrentMillisecond + difference) / 1000);
    }
    return Math.ceil(Number(songCurrentMillisecond) / 1000)
}