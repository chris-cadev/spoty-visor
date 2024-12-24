import type { APIRoute } from "astro";
import { exec } from "@api/common/exec";

// REF: https://stackoverflow.com/a/77233737
const SEARCH_FLAGS = [
    "--default-search ytsearch",
    "--dump-json",
    "--no-playlist",
    "--no-check-certificate",
    "--quiet",
    "--skip-download",
    "--ignore-errors",
    "--geo-bypass",
    "--flat-playlist"
].join(" ")


const searchVideos = async (term: string, quantity: string) => {
    const command = `yt-dlp -s ytsearch${quantity}:"${term}" ${SEARCH_FLAGS}`
    const shellResponse = await exec(command);
    if (shellResponse.error) {
        throw new Error(shellResponse.error);
    }
    return shellResponse.output.map(raw => JSON.parse(raw)) as any[];
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q');
    const count = url.searchParams.get('c');
    if (!query) {
        return new Response(null);
    }
    if (!Number.isInteger(Number(count))) {
        return new Response(null);
    }
    const results = await searchVideos(query, count ?? '3');
    const youtubeVideos = results.map<{ url: string, name: string, thumbnail: string }>((r: any) => ({
        url: `https://www.youtube.com/embed/${r.id}`, name: r.title, thumbnail: r.thumbnails[r.thumbnails.length - 1].url
    }));
    return new Response(JSON.stringify(youtubeVideos))
}