interface ImportMetaEnv {
    readonly spotify_client_id: string;
    readonly spotify_client_secret: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}