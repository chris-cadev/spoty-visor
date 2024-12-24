import type { JWT } from "@auth/core/jwt";

export interface SpotifyToken extends JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
}