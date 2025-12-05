/// <reference types="vite/client" />

declare namespace NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        NODE_ENV?: string;
        VITE_GOOGLE_CLIENT_ID?: string;
        VITE_API_KEY?: string;
        GOOGLE_CLIENT_ID?: string;
        API_KEY?: string;
    }
}
