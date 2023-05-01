import type { NextFunction, Request, Response } from "express";

import { TokenExpiredError } from "jsonwebtoken";
import tokenService from "../services/token-service";
import HTTPError from "../errors/HTTPError";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new HTTPError(401);
        }

        // authHeader has a form like: "Bearer {accesToken}"
        const accessToken = authHeader.split(` `)[1];

        if (!accessToken) {
            throw new HTTPError(401);
        }

        const jwtUserData = tokenService.validateAccessToken(accessToken);

        if (!jwtUserData) {
            throw new HTTPError(401);
        }

        /**
         * @IMPORTANT This property will exist only if this middleware was used previously.
         *
         * P.S. There are actualy 2 extra properties which is added by JWT, but i don't need them.
         */
        req.body.user = jwtUserData as any;

        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ tokenExpired: true, message: "Access token has expired" });
            return;
        }

        if (err instanceof HTTPError) {
            if (err.errorCode === 401) {
                res.status(err.errorCode).json({ message: `Для выполнения этой операции требуется аутентификация.` });
                return;
            }

            if (err.errorCode === 403) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }
        }

        console.error(err);
        res.status(500).json({ message: "Что-то пошло не так..." });
    }
}
