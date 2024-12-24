
const getCurrentSong = () => {
    return {};
};


export async function GET() {
    const currentSong = getCurrentSong();
    return new Response(JSON.stringify(currentSong))
}