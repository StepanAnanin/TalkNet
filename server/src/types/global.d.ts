import { User } from "./DB/models/User";
import { Request } from "express";

interface UserData extends User {
    id: string;

    // This user data received from access token.
    // Properties below added by JWT library.
    // (I don't need them actually, but it's bad to leave them unaccounted)
    iat: number;
    exp: number;
}

declare module "express" {
    interface Request {
        body: {
            /**
             * `IMPORTANT` — This property will exist only if authMiddleware middleware was used previously.
             */
            user: UserData;
            [key: string]: any;
        };
    }
}
