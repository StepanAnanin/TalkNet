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
        const refreshToken = req.cookies.refreshToken as string | undefined;

        if (!accessToken || !refreshToken) {
            throw new HTTPError(401);
        }

        const jwtUserData = tokenService.validateAccessToken(accessToken);

        if (!jwtUserData) {
            throw new HTTPError(401);
        }

        // @ts-ignore
        req.user = jwtUserData;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ message: "Access token is expired" });
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
    } finally {
        next();
    }
}
