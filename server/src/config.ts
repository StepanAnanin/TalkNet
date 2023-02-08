import type { CorsOptions } from "cors";
import type UserAccessLevel from "./types/UserAccessLevel";

// TODO Now will work only in dev mode
const clientURL = "http://localhost:3000";
const API_URL = "http://localhost:" + process.env.SERVER_PORT;

const config = {
    ROOT_PATH: __dirname,

    CLIENT_URL: clientURL,

    API_URL: API_URL,

    CORS_OPTIONS: {
        credentials: true,
        origin: clientURL,
    } as CorsOptions,

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
