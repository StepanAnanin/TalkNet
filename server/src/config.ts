import type { CorsOptions } from "cors";
import type UserAccessLevel from "./types/UserAccessLevel";

type SMTP_OPTIONS = {
    HOST_NAME: string;
    USER_NAME: string;
    PORT: number;
    PASSWORD: string;
};

// TODO Now will work only in dev mode
const clientURL = "http://localhost:3005";
const API_URL = "http://localhost:" + process.env.SERVER_PORT;

const config = {
    ROOT_PATH: __dirname,

    CLIENT_URL: clientURL,

    API_URL: API_URL,

    CORS_OPTIONS: {
        credentials: true,
        origin: clientURL,
    } as CorsOptions,

    SMTP: {
        HOST_NAME: "smtp.gmail.com",
        USER_NAME: "talknetru@gmail.com",
        PORT: 587,
        PASSWORD: process.env.SMTP_SPARE_PASSWORD, // BUG CRITICAL for some reason main password isn't work...
    } as SMTP_OPTIONS,

    USER_ACCESS_LEVELS: {
        unlimited: 0,
        administrator: 1,
        moderator: 2,
        assistant: 3,
        defaultUser: 4,
        restrictedUser: 5,
        bannedUser: 6,
    } as UserAccessLevel,
} as const;

export default config;
