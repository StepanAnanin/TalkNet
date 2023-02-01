import type { CorsOptions } from "cors";

// TODO Now will work only in dev mode
const clientURL = "http://localhost:3000";

const config = {
    ROOT_PATH: __dirname,

    CLIENT_URL: clientURL,

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
    },
} as const;

export default config;
