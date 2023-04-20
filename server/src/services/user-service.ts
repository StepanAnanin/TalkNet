import type IUser from "../types/DB/models/User";

import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { v4 as uuid } from "uuid";
import userModel from "../DB/models/User";
import bcrypt from "bcrypt";
import EMailService from "./email-service";
import tokenService from "./token-service";
import UserDTO from "../DTO/user-DTO";
import config from "../config";
import HTTPError from "../errors/HTTPError";

import emailService from "./email-service";
import multer from "multer";
import tokenModel from "../DB/models/Token";
import { ObjectId } from "mongodb";

/**
 * @IMPORTANT Right now user can login in system only from 1 device at once
 */

class UserService {
    protected createUserDTO(user: IUser) {
        return new UserDTO({
            id: user._id,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            email: user.email,
            lastPasswordChange: user.settings.lastPasswordChange,
            isActivated: user.activationState.isActivated,
            isAccountDeletionInProcess: user.settings.accountDeletionState.isInitialized,
            isEmailChangeInProcess: user.settings.emailChangeState.isInitialized,
        });
    }

    protected async verifyAuth(user: IUser, password: string) {
        return await bcrypt.compare(password, user.password);
    }

    public async getUserIdByEmail(email: string) {
        const user = await userModel.findOne({ email });

        return user ? user._id.toString() : null;
    }

    public async getUserIdByRefreshToken(refreshToken: string): Promise<string | null> {
        const refreshTokenData = await tokenModel.findOne({ refreshToken });

        if (!refreshTokenData) {
            return null;
        }

        const user = await userModel.findOne({ _id: refreshTokenData.user });

        return user ? user._id.toString() : null;
    }

    public async registrate(name: string, surname: string, patronymic: string | null, email: string, password: string) {
        if (await userModel.findOne({ email })) {
            throw new HTTPError(409, `Пользователь с адресом электронной почты ${email} уже зарегестрирован.`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = uuid();

        const user = await userModel.create({
            name,
            surname,
            patronymic,
            email,
            password: hashedPassword,
            activationState: {
                isActivated: false,
                link: activationLink,
            },
        } as IUser);

        try {
            await fs.mkdir(path.join(config.ROOT_PATH, "/static/user", user._id.toString()));
        } catch (err) {
            console.error(err);

            await userModel.deleteOne({ email, password: hashedPassword });

            throw new Error(`Не удалось создать папку с статичными данными пользователя`);
        }

        try {
            await EMailService.sendActivationEMail(email, config.API_URL + "/user/activate/" + activationLink);
        } catch (err) {
            console.error(err);

            await userModel.deleteOne({ email, password: hashedPassword });

            throw new Error(`Не удалось отправить электронное письмо с ссылкой активации аккаунта.`);
        }

        const userDTO = this.createUserDTO(user);
        const tokens = tokenService.generateTokens({ ...userDTO });

        await tokenService.saveRefreshTokenToDB(user._id, tokens.refreshToken);

        console.log("\x1b[45m", `New user was created; id: ${user._id}, E-Mail: ${user.email}`, "\x1b[0m");

        return { user: userDTO };
    }

    public async login(email: string, password: string) {
        const user = await userModel.findOne({ email });

        if (!user || !(await this.verifyAuth(user, password))) {
            throw new HTTPError(400, `Неверный EMail или пароль`);
        }

        if (user.accessLevel === config.USER_ACCESS_LEVELS.bannedUser) {
            throw new HTTPError(403, "Данный аккаунт заблокирован");
        }

        const userDTO = this.createUserDTO(user);
        const tokens = tokenService.generateTokens({ ...userDTO });

        await tokenService.saveRefreshTokenToDB(user._id, tokens.refreshToken);

        console.log(`User ${user._id} logged in`);

        return { ...tokens, user: userDTO };
    }

    public async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);

        return token;
    }

    public async updateRefreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new Error(`Refresh token is missing`);
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDB) {
            throw new HTTPError(401, `User isn't authenticated`);
        }

        const user = (await userModel.findOne({ email: userData.email }))!;

        const userDTO = this.createUserDTO(user);
        const tokens = tokenService.generateTokens({ ...userDTO });

        await tokenService.saveRefreshTokenToDB(user._id, tokens.refreshToken);

        return { ...tokens, user: userDTO };
    }

    public async activateAccount(activationLink: string) {
        const user = await userModel.findOne({ "activationState.link": activationLink });

        if (!user) {
            throw new HTTPError(404, `Пользователь с ссыклой активации ${activationLink} не был найден.`);
        }

        user.activationState.isActivated = true;
        user.accessLevel = config.USER_ACCESS_LEVELS.defaultUser;
        user.activationState.link = null;

        await user.save();

        console.log(`Account ${user._id} was successfully activated`);
    }

    public async changePassword(email: string, currentPassword: string, newPassword: string) {
        const user = await userModel.findOne({ email });

        if (!user || !(await this.verifyAuth(user, currentPassword))) {
            throw new HTTPError(400, `Неверный EMail или пароль`);
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user!.save();
    }

    public async changeUserName(email: string, password: string, newUsername: string) {
        throw new Error(`Not implemented`);
    }

    public async configureAvatarUploader() {
        const fileStorageEngine = multer.diskStorage({
            destination: async (request, file, callback) => {
                let error: null | Error = null;

                const userId = request.query.userId;

                if (typeof userId !== "string") {
                    callback(new Error(`Missing userId property in query params`), "");
                    return;
                }

                const avatarUploadAbsolutePath = path.join(config.ROOT_PATH, "/static/user", userId);

                if (!error && !fsSync.existsSync(avatarUploadAbsolutePath)) {
                    error = new Error(`Критическая ошибка: Папка с статичными файлами пользователя не существует.`);
                }

                // if upload was canceled need to delete what managed to upload from file. (Cuz this file will be corrupted)
                request.on("aborted", () => {
                    file.stream.on("end", async () => {
                        await fs.unlink(avatarUploadAbsolutePath);
                    });

                    file.stream.emit("end");
                });

                callback(error, avatarUploadAbsolutePath);
            },
            filename: (request, file, callback) => {
                callback(null, "avatar.jpg");
            },
        });

        const upload = multer({ storage: fileStorageEngine });

        return upload.single("selected-avatar");
    }

    public async isUserBanned(userId: string) {
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            throw new Error(`User wasn't found`);
        }

        return user.accessLevel === config.USER_ACCESS_LEVELS.bannedUser;
    }

    // TODO try to make it more compact (i just didn't want to fuck with mongodb queries which are implemented as shit)
    public async searchForUser(page: number, name?: string, surname?: string, patronymic?: string) {
        if (page < 1) {
            throw new HTTPError(400, "Page must be equal or greater than 1");
        }

        page = page - 1;

        // if all
        if (typeof name === "string" && typeof surname === "string" && typeof patronymic === "string") {
            return await userModel.find(
                {
                    name: new RegExp("^" + name + "$", "i"),
                    surname: new RegExp("^" + surname + "$", "i"),
                    patronymic: new RegExp("^" + patronymic + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if name & surname
        if (typeof name === "string" && typeof surname === "string") {
            return await userModel.find(
                {
                    name: new RegExp("^" + name + "$", "i"),
                    surname: new RegExp("^" + surname + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if name & patronymic
        if (typeof name === "string" && typeof patronymic === "string") {
            return await userModel.find(
                {
                    name: new RegExp("^" + name + "$", "i"),
                    patronymic: new RegExp("^" + patronymic + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if surname & patronymic
        if (typeof surname === "string" && typeof patronymic === "string") {
            return await userModel.find(
                {
                    surname: new RegExp("^" + surname + "$", "i"),
                    patronymic: new RegExp("^" + patronymic + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if only surname
        if (typeof surname === "string") {
            return await userModel.find(
                {
                    surname: new RegExp("^" + surname + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if only name
        if (typeof name === "string") {
            console.log(1);
            return await userModel.find(
                {
                    name: new RegExp("^" + name + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if only patronymic
        if (typeof patronymic === "string") {
            return await userModel.find(
                {
                    patronymic: new RegExp("^" + patronymic + "$", "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }
    }

    public async addUserToFriendList(targetID: string, initiatorID: string) {
        if (!ObjectId.isValid(targetID)) {
            throw new HTTPError(400, "Targeted user has incorrect id format");
        }

        if (!ObjectId.isValid(initiatorID)) {
            throw new HTTPError(400, "Initiator user has incorrect id format");
        }

        const targetedUser = await userModel.findOne({ _id: targetID });
        const initiatorUser = await userModel.findOne({ _id: initiatorID });

        if (!targetedUser) {
            throw new HTTPError(404, "Targeted user wasn't found");
        }

        if (!initiatorUser) {
            throw new HTTPError(404, "Initiator user wasn't found");
        }

        initiatorUser.friends.push(targetID);

        await initiatorUser.save();
    }
}

export default new UserService();
