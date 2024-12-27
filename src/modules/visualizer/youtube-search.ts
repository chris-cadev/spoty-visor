export interface Video {
    url: string;
    duration: number;
    start?: number
    name: string;
}

export const searchVideos = (term: string, quantity: number): Promise<[Video, Video, Video]> => {
    const body = { q: encodeURIComponent(term), c: encodeURIComponent(quantity) } as any;
    return fetch(`/api/yt-search?${Object.keys(body).map((param) => `${param}=${body[param]}`).join("&")}`).then(r => r.json());
}