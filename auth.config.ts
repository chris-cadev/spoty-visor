import { defineConfig } from "auth-astro";
import Spotify from "@auth/core/providers/spotify";
import type { SpotifyToken } from "@modules/auth/spotify-token";

export default defineConfig({
    providers: [
        Spotify({
            clientId: import.meta.env.SPOTIFY_CLIENT_ID,
            clientSecret: import.meta.env.SPOTIFY_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // ------------------ JWT CALLBACK ------------------
        async jwt({ token, account }) {
            // Cast the generic `token` to our extended interface.
            const spotifyToken = token as SpotifyToken;

            // If signing in (the user just authorized on Spotify)
            if (account) {
                // `account` has data from the provider
                spotifyToken.accessToken = account.access_token ?? "";
                spotifyToken.refreshToken = account.refresh_token ?? "";
                // expires_at is in seconds from Spotify, convert to ms:
                if (typeof account.expires_at === "number") {
                    spotifyToken.expiresAt = account.expires_at * 1000;
                }
            }

            // Check if token is expired
            if (spotifyToken.expiresAt && Date.now() > spotifyToken.expiresAt) {
                try {
                    // Try refreshing
                    const refreshResponse = await fetch("https://accounts.spotify.com/api/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization:
                                "Basic " +
                                btoa(
                                    `${import.meta.env.SPOTIFY_CLIENT_ID}:${import.meta.env.SPOTIFY_CLIENT_SECRET}`
                                ),
                        },
                        body: new URLSearchParams({
                            grant_type: "refresh_token",
                            // We cast `spotifyToken.refreshToken` to string because we know it should be a string
                            refresh_token: spotifyToken.refreshToken as string,
                        }),
                    }).then((res) => res.json());

                    // Update fields on our token
                    spotifyToken.accessToken = refreshResponse.access_token;
                    spotifyToken.expiresAt = Date.now() + refreshResponse.expires_in * 1000;
                    if (refreshResponse.refresh_token) {
                        spotifyToken.refreshToken = refreshResponse.refresh_token;
                    }
                } catch (err) {
                    console.error("Error refreshing Spotify token:", err);
                    // If refresh fails, we can return the old token or null. 
                    // Let's keep the old token to not log the user out:
                }
            }

            // IMPORTANT: Always return the token (or null) at the end
            return spotifyToken;
        },

        // ------------------ SESSION CALLBACK ------------------
        async session({ session, token }) {
            // We know `token` is SpotifyToken
            const spotifyToken = token as SpotifyToken;

            // TypeScript won't let you add arbitrary properties to `session` 
            // unless you cast it to an extended session type (see step #4 below).
            // For now, we can do:
            (session as any).accessToken = spotifyToken.accessToken;
            (session as any).refreshToken = spotifyToken.refreshToken;
            (session as any).expiresAt = spotifyToken.expiresAt;

            return session;
        },
    },
});
