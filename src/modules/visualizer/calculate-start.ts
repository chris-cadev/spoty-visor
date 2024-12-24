
export const getVideoStartSecond = (videoDuration: number, songCurrentMillisecond: number, songDuration: number) => {
    const isVideoLargerThanSong = songDuration < videoDuration;
    const difference = Math.abs(videoDuration - songDuration);
    if (isVideoLargerThanSong) {
        return Math.ceil((songCurrentMillisecond + difference) / 1000);
    }
    return Math.ceil(Number(songCurrentMillisecond) / 1000)
}