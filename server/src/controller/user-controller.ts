import type { Request, Response, NextFunction } from "express";

import config from "../config";
import HTTPError from "../errors/HTTPError";
import UserService from "../services/user-service";
import validateRequest from "../lib/validators/validateRequest";
import ChatService from "../services/chat-service";

class UserContoller {
    public async registrate(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const surname = req.body.surname;
        const patronymic = req.body.patronymic ?? null;

        const requestValidationResult = validateRequest(req.body, [
            { key: "password", type: "string" },
            { key: "name", type: "string" },
            { key: "surname", type: "string" },
            { key: "email", type: "string" },
        ]);

        if (!requestValidationResult.ok) {
            res.status(400).json({ message: requestValidationResult.message });
            return;
        }

        // ========================== Email validation ==========================

        // TODO refactoring?
        if (
            !email.includes("@") ||
            email.split("@").length !== 2 ||
            !email.split("@").at(-1)!.includes(".") ||
            email.split("@").at(-1)!.length < 3
        ) {
            res.status(400).json({ message: `EMail имеет неправильный формат.`, email });
            return;
        }

        if (email.length > 32) {
            res.status(400).json({
                message: `EMail слишком длинный. Максимально допустимая длинна — 32 символа`,
            });
            return;
        }

        if (email.length < 5) {
            res.status(400).json({
                message: `EMail слишком короткий. Минимально допустимая длинна — 5 символов`,
            });
            return;
        }

        if (name.length > 64) {
            res.status(400).json({ message: "Имя пользователя слишком длинное." });
            return;
        }

        if (surname.length > 64) {
            res.status(400).json({ message: "Фамилия пользователя слишком длинная." });
            return;
        }

        // ========================== Patronymic validation ==========================

        if (patronymic !== null) {
            if (typeof patronymic !== "string") {
                res.status(400).json({ message: "Отчество пользователя имеет не правильный тип данных." });
                return;
            }

            if (!patronymic.replaceAll(" ", "")) {
                res.status(400).json({ message: `Отчество пользователя имеет недопустимое значение.` });
                return;
            }

            if (patronymic.length > 64) {
                res.status(400).json({ message: `Отчество пользователя слишком длинное.` });
                return;
            }
        }

        try {
            const userData = await UserService.registrate(name, surname, patronymic, email, password);

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

        const requestValidationResult = validateRequest(req.body, [
            { key: "password", type: "string" },
            { key: "email", type: "string" },
        ]);

        if (!requestValidationResult.ok) {
            res.status(400).json({ message: requestValidationResult.message });
            return;
        }

        try {
            const userData = await UserService.login(email, password);

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

    // BUG Now not removing refresh token from cookies for some reason.
    public async logout(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const refreshToken = req.cookies.refreshToken;

        try {
            await UserService.logout(refreshToken);

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
            await UserService.activateAccount(activationLink);

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
        res.setHeader("Accept-Charset", "utf-8");

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(400).json({ message: "Missing refresh token" });
            return;
        }

        try {
            const userData = await UserService.updateRefreshToken(refreshToken);

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

    public async getUserChats(req: Request<{ id: string }>, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const userID = req.params.id;

        if (typeof userID !== "string") {
            res.status(400).json({ message: "Missing property 'userID'" });
            return;
        }

        try {
            const userChats = await ChatService.getUserChatsInfo(userID);

            res.status(200).json(userChats);
        } catch (err: any) {
            if (err instanceof HTTPError && err.errorCode === 401) {
                res.status(err.errorCode).json({ message: `Требуется аутентификация` });
                return;
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async sendFriendRequest(req: Request, res: Response) {
        const from = req.body.from as string;
        const to = req.body.to as string;

        const validationResult = validateRequest(req.body, [
            { key: "from", type: "string" },
            { key: "to", type: "string" },
        ]);

        if (!validationResult.ok) {
            res.status(400).json({ message: validationResult.message });
            return;
        }

        try {
            await UserService.sendFriendRequest(to, from);

            res.status(200).json({ message: "Заявка на добавление в друзья отправлена" });
        } catch (err: any) {
            if (err instanceof HTTPError) {
                if (err.errorCode === 401) {
                    res.status(err.errorCode).json({ message: `Требуется аутентификация` });
                    return;
                }

                if (err.errorCode === 409) {
                    res.status(err.errorCode).json({ message: err.message });
                    return;
                }
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async acceptFriendRequest(req: Request, res: Response) {
        const from = req.body.from as string;
        const to = req.body.to as string;

        const validationResult = validateRequest(req.body, [
            { key: "from", type: "string" },
            { key: "to", type: "string" },
        ]);

        if (!validationResult.ok) {
            res.status(400).json({ message: validationResult.message });
            return;
        }

        try {
            await UserService.acceptFriendRequest(to, from);

            res.status(200).json({ message: "Заявка на добавление в друзья принятна" });
        } catch (err: any) {
            if (err instanceof HTTPError) {
                if (err.errorCode === 401) {
                    res.status(err.errorCode).json({ message: `Требуется аутентификация` });
                    return;
                }

                if (err.errorCode === 409) {
                    res.status(err.errorCode).json({ message: err.message });
                    return;
                }
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async deleteFriend(req: Request<{ id: string }>, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const user = req.body.user;

        if (!user) {
            res.status(500).json({ message: "Не удалось получить данные пользователя" });
            return;
        }

        try {
            await UserService.deleteFriend(user.id, req.params.id);

            res.status(200).json({ message: `Пользователь успешно удалён из списка друзей` });
        } catch (err) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            console.error(err);
            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async declineFriendRequest(req: Request, res: Response) {
        const from = req.body.from as string;
        const to = req.body.to as string;

        const validationResult = validateRequest(req.body, [
            { key: "from", type: "string" },
            { key: "to", type: "string" },
        ]);

        if (!validationResult.ok) {
            res.status(400).json({ message: validationResult.message });
            return;
        }

        try {
            await UserService.declineFriendRequest(to, from);

            res.status(200).json({ message: "Заявка на добавление в друзья отклонена" });
        } catch (err: any) {
            if (err instanceof HTTPError) {
                if (err.errorCode === 401) {
                    res.status(err.errorCode).json({ message: `Требуется аутентификация` });
                    return;
                }

                if (err.errorCode === 409) {
                    res.status(err.errorCode).json({ message: err.message });
                    return;
                }
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async getParsedUserFriendRequests(req: Request, res: Response) {
        const user = req.body.user;
        const requestsType = req.query.type;

        if (requestsType !== "incoming" && requestsType !== "outcoming") {
            res.status(400).json({ message: "Query param `requestsType` is missing or has incorrect value" });
            return;
        }

        if (!user) {
            res.status(400).json({ message: "Не удалось получить данные пользователя" });
            return;
        }

        try {
            const parsedFriendRequests = await UserService.getParsedUserFriendRequests(requestsType, user.id);

            res.status(200).json(parsedFriendRequests);
        } catch (err: any) {
            if (err instanceof HTTPError) {
                if (err.errorCode === 400 || err.errorCode === 404) {
                    res.status(err.errorCode).json({ message: err.message });
                    return;
                }
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async getParsedUserFriends(req: Request, res: Response) {
        const user = req.body.user;

        if (!user) {
            res.status(400).json({ message: "Не удалось получить данные пользователя" });
            return;
        }

        try {
            const parsedFriendRequests = await UserService.getParsedUserFriends(user.id);

            res.status(200).json(parsedFriendRequests);
        } catch (err: any) {
            if (err instanceof HTTPError) {
                if (err.errorCode === 400 || err.errorCode === 404) {
                    res.status(err.errorCode).json({ message: err.message });
                    return;
                }
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }

    public async changeEmail(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const user = req.body.user;
        const newEmail = req.body.newEmail;
        const password = req.body.password;

        if (!newEmail) {
            res.status(400).json({ message: "newEmail property is missing in request body" });
            return;
        }

        if (!password) {
            res.status(400).json({ message: "password property is missing in request body" });
            return;
        }

        if (!user) {
            res.status(500).json({ message: "Не удалось получить информацию о пользователе" });
            return;
        }

        if (!user.isActivated) {
            res.status(400).json({ message: "Для выполнения это операции необходимо активировать аккаунт" });
            return;
        }

        if (newEmail === user.email) {
            res.status(409).json({ message: "Новый и старый E-Mail'ы совпадают" });
            return;
        }

        try {
            await UserService.changeEmail(user.email, newEmail, password);

            res.status(200).json({ message: `E-Mail успешно изменён.` });
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
        res.setHeader("Accept-Charset", "utf-8");

        const user = req.body.user;

        if (!user) {
            res.status(400).json({ message: "Не удалось получить данные пользователя" });
            return;
        }

        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const requestValidationResult = validateRequest(req.body, [
            { key: "currentPassword", type: "string" },
            { key: "newPassword", type: "string" },
        ]);

        if (!requestValidationResult.ok) {
            res.status(400).json({ message: requestValidationResult.message });
            return;
        }

        try {
            await UserService.changePassword(user.email, currentPassword, newPassword);

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

    public async changeFullname(req: Request, res: Response) {
        res.setHeader("Accept-Charset", "utf-8");

        const name = req.body.name;
        const surname = req.body.surname;
        const patronymic = req.body.patronymic;
        const user = req.body.user;

        const propertiesToValidate = [
            { key: "name", type: "string" },
            { key: "surname", type: "string" },
        ];

        if (patronymic !== null) {
            propertiesToValidate.push({ key: "patronymic", type: "string" });
        }

        const requestValidationResult = validateRequest(req.body, propertiesToValidate as any[]);

        if (!requestValidationResult.ok) {
            res.status(400).json({ message: requestValidationResult.message });
            return;
        }

        if (!user) {
            res.status(500).json({ message: "Не удалось получить информацию о пользователе" });
            return;
        }

        try {
            await UserService.changeFullname(user.id, name, surname, patronymic);

            res.status(200).json({ message: `Данные успешно изменены.` });
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
        if (!req.headers["content-type"]?.includes("multipart/form-data")) {
            res.status(400).send({ message: `Only requests of content-type 'multipart/form-data' supported` });
            return;
        }

        const user = req.body.user;

        if (!user) {
            res.status(400).json({ message: "Не удалось получить данные пользователя" });
            return;
        }

        try {
            const avatarUploader = await UserService.configureAvatarUploader(user.id);

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
