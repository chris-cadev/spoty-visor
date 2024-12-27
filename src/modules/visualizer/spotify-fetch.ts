/**
 * Root interface for the "Get the User's Currently Playing Track" response.
 * https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
 */
export interface CurrentlyPlayingResponse {
    device: SpotifyDevice;
    repeat_state: string;
    shuffle_state: boolean;
    context: SpotifyContext;
    timestamp: number;
    progress_ms: number;
    is_playing: boolean;
    item: SpotifyTrack;
    currently_playing_type: string;
    actions: SpotifyActions;
}

/**
 * Information about the device that is currently active.
 */
export interface SpotifyDevice {
    id: string | null;            // Device can sometimes have a null id
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number | null; // volume_percent can also be null in some cases
    supports_volume: boolean;      // Custom field from your example
}

/**
 * A context object that includes the context the track is being played from.
 */
export interface SpotifyContext {
    type: string;
    href: string | null; // Spotify sometimes returns null href
    external_urls: SpotifyExternalUrls;
    uri: string | null;  // Can be null if there’s no context
}

/**
 * The external URL object used throughout Spotify API responses.
 */
export interface SpotifyExternalUrls {
    spotify: string;
}

/**
 * Represents the track (or episode) that’s currently playing.
 */
export interface SpotifyTrack {
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: SpotifyExternalIds;
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: Record<string, unknown>; // Additional data if linked from another track
    restrictions?: SpotifyRestrictions;   // Marked optional because it may be missing
    name: string;
    popularity: number;
    preview_url: string | null; // Can be null if not available
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

/**
 * Album information for the track being played.
 */
export interface SpotifyAlbum {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: SpotifyRestrictions; // May be omitted in some cases
    type: string;
    uri: string;
    artists: SpotifyArtist[];
}

/**
 * Basic artist information as it appears in track or album arrays.
 */
export interface SpotifyArtist {
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

/**
 * An image object that appears in albums, artists, playlists, etc.
 */
export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

/**
 * External IDs for a track, such as ISRC, EAN, and UPC.
 */
export interface SpotifyExternalIds {
    isrc?: string;
    ean?: string;
    upc?: string;
}

/**
 * Restriction information for content that may not be available in certain markets.
 */
export interface SpotifyRestrictions {
    reason: string;
}

/**
 * Actions that can be performed against the currently playing track.
 */
export interface SpotifyActions {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
}

export interface CurrentSong {
    id: string,
    type: 'track' | string,
    name: string,
    artists: {
        main: string,
        ft: null | string[]
    },
    duration: number;
    current: number;
}


export const getCurrentPlaying = async (token: string): Promise<CurrentSong> => {
    const playing: CurrentlyPlayingResponse = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    ).then(async (res) => {
        const text = await res.text()
        const isEmpty = text.length === 0;
        if (isEmpty) {
            return null;
        }
        return JSON.parse(text);
    })
    if (!playing) {
        return playing;
    }
    const [mainArtist, ...featuringArtitsts] = playing.item.artists;
    return {
        id: playing.item.id,
        type: playing.currently_playing_type,
        name: playing.item.name,
        artists: {
            main: mainArtist.name,
            ft: featuringArtitsts.length === 0 ? null : featuringArtitsts.map((a) => a.name),
        },
        duration: playing.item.duration_ms,
        current: playing.progress_ms,
    }
}