import type { Request, Response, NextFunction } from "express";

import config from "../config";
import HTTPError from "../errors/HTTPError";
import userModel from "../DB/models/User";
import userService from "../services/user-service";

class UserContoller {
    public async registrate(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const email = req.body.email;
        const password = req.body.password;
        const userName = req.body.userName;

        if (!email || typeof email !== "string") {
            res.status(400).json({ message: `EMail пользователя не указан или имеет не правильный тип данных.` });
            return;
        }

        if (
            !email.includes("@") ||
            email.split("@").length !== 2 ||
            !email.split("@").at(-1)!.includes(".") ||
            email.split("@").at(-1)!.length < 3
        ) {
            res.status(400).json({ message: `Переданный EMail имеет неправильный формат.`, email });
            return;
        }

        if (email.length > 32) {
            res.status(400).json({
                message: `Переданный EMail слишком длинный. Максимально допустимая длинна — 32 символа`,
            });
            return;
        }

        if (email.length < 5) {
            res.status(400).json({
                message: `Переданный EMail слишком короткий. Минимально допустимая длинна — 5 символов`,
            });
            return;
        }

        if (!password || typeof password !== "string") {
            res.status(400).json({ message: `Пароль пользователя не указан или имеет не правильный тип данных.` });
            return;
        }

        if (!userName || typeof userName !== "string") {
            res.status(400).json({ message: `Имя пользователя не указано или имеет не правильный тип данных.` });
            return;
        }

        if (!userName.replaceAll(" ", "")) {
            res.status(400).json({ message: "Имя пользователя не указанно." });
            return;
        }

        if (userName.length > 64) {
            res.status(400).json({ message: "Имя пользователя слишком длинное." });
            return;
        }

        try {
            const userData = await userService.registrate(userName, email, password);

            res.status(200).json({ message: `Пользователь успешно создан`, ...userData });
        } catch (err: any) {
            if (err instanceof HTTPError && err.errorCode === 409) {
                res.status(409).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.log(err);
        }
    }

    public async login(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const email = req.body.email;
        const password = req.body.password;

        if (!email || typeof email !== "string") {
            res.status(400).json({ message: `EMail пользователя не указан или имеет не правильный тип данных.` });
            return;
        }

        if (!password || typeof password !== "string") {
            res.status(400).json({ message: `Пароль пользователя не указан или имеет не правильный тип данных.` });
            return;
        }
        try {
            const userData = await userService.login(email, password);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 14 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: "/",
            });

            res.status(200).json({
                message: `Пользователь успешно аутентифицированн.`,
                accessToken: userData.accessToken,
                user: { ...userData.user },
            });
        } catch (err: any) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.log(err);
        }
    }

    public async logout(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const refreshToken = req.cookies.refreshToken;

        try {
            await userService.logout(refreshToken);

            res.clearCookie("refreshToken");
            res.status(200).json({ message: "Выход из системы выполнен успешно." });

            console.log("User logged out");
        } catch (err) {
            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async activateAccount(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const activationLink = req.params.link;

        if (!activationLink) {
            res.status(400).json({ message: "Missing link param" });
        }

        try {
            await userService.activateAccount(activationLink);

            res.redirect(config.CLIENT_URL);
        } catch (err: any) {
            if (err instanceof HTTPError) {
                if (err.errorCode === 404) {
                    res.status(404).json({ message: `Ссылка активации не действительна.` });
                    return;
                }

                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
        }
    }

    public async updateRefreshToken(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(400).json({ message: "Missing refresh token" });
            return;
        }

        try {
            const userData = await userService.updateRefreshToken(refreshToken);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                httpOnly: true,
                path: "/",
            });

            res.status(200).json({
                message: `Refresh token successfully updated.`,
                accessToken: userData.accessToken,
                user: { ...userData.user },
            });
        } catch (err: any) {
            if (err instanceof HTTPError && err.errorCode === 401) {
                res.status(err.errorCode).json({ message: `Требуется аутентификация` });
                return;
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async changeUserName(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const email = req.body.email;
        const password = req.body.password;
        const newUsername = req.body.newUsername;

        if (typeof password !== "string" || typeof email !== "string" || typeof newUsername !== "string") {
            res.status(400).json({
                message:
                    "Type Error: request's body must have this properties: password, email, newUserName which are all string",
            });
            return;
        }

        if (!newUsername.replaceAll(" ", "")) {
            res.status(400).json({ message: "Недопустимое имя пользователя" });
            return;
        }

        if (newUsername.length > 64) {
            res.status(400).json({ message: "Имя пользователя слишком длинное" });
            return;
        }

        try {
            await userService.changeUserName(email, password, newUsername);

            res.status(200).json({ message: `Имя пользователя успешно изменено.` });
        } catch (err) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            console.error(err);
            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async changePassword(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const email = req.body.email;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        if (typeof currentPassword !== "string" || typeof email !== "string" || typeof newPassword !== "string") {
            res.status(400).json({
                message:
                    "Invalid request: request's body must have this properties: currentPassword, email, newPassword which are all string",
            });
            return;
        }

        try {
            await userService.changePassword(email, currentPassword, newPassword);

            res.status(200).json({ message: `Пароль успешно изменён.` });
        } catch (err) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            console.error(err);
            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async changeAvatar(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        if (!req.headers["content-type"]?.includes("multipart/form-data")) {
            res.status(400).send({ message: `Only requests of content-type 'multipart/form-data' supported` });
            return;
        }

        try {
            const avatarUploader = await userService.configureAvatarUploader();

            const uploadErrorHandler: NextFunction = (err) => {
                if (err) {
                    const errorMessage = `User avatar change error: ${err.message}`;

                    console.error(errorMessage);
                    res.status(500).send({ message: errorMessage });
                } else {
                    res.status(200).send({ message: "User avatar successfuly changed" });
                }
            };

            return avatarUploader(req, res, uploadErrorHandler);
        } catch (err) {
            console.error(err);

            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }
}

export default new UserContoller();
