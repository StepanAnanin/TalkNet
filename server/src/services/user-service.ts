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

// TODO add protected method for userID validation
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

            // If cast "any" types to "string" there will be error.
            // This doesn't affect anything, cuz ObjectId is string.
            friends: user.friends as any[],
            incomingFriendRequests: user.incomingFriendRequests as any[],
            outcomingFriendRequests: user.outcomingFriendRequests as any[],
            blackList: user.blackList as any[],
        });
    }

    protected getBaseUserInfo(user: IUser) {
        return {
            id: user._id,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
        };
    }

    protected async getUserByID(userID: string) {
        if (!ObjectId.isValid(userID)) {
            throw new HTTPError(400, "User ID has incorrect format");
        }

        const user = await userModel.findById(userID);

        if (!user) {
            throw new HTTPError(404, "User wasn't found");
        }

        return user;
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
        const user = await this.getUserByID(userId);

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

    public async sendFriendRequest(to: string, from: string) {
        const targetedUser = await this.getUserByID(to);
        const sender = await this.getUserByID(from);

        // "from" is already validated, see above
        if (targetedUser.incomingFriendRequests.includes(from as any)) {
            throw new HTTPError(409, "Заявка в друзья этому пользователю уже отправлена");
        }

        targetedUser.incomingFriendRequests.push(from);
        sender.outcomingFriendRequests.push(to);

        await targetedUser.save();
        await sender.save();
    }

    public async acceptFriendRequest(to: string, from: string) {
        const targetedUser = await this.getUserByID(to);
        const sender = await this.getUserByID(from);

        // "from" and "to" is already validated in this.getUser
        const incomingFriendRequestID = targetedUser.incomingFriendRequests.indexOf(from as any);
        const outcomingFriendRequestID = sender.outcomingFriendRequests.indexOf(to as any);

        if (incomingFriendRequestID === -1) {
            throw new HTTPError(404, "Не удалось найти заявку в друзья");
        }

        targetedUser.incomingFriendRequests.splice(incomingFriendRequestID, 1);
        sender.outcomingFriendRequests.splice(outcomingFriendRequestID, 1);

        targetedUser.friends.push(from);
        sender.friends.push(to);

        await targetedUser.save();
        await sender.save();
    }

    public async declineFriendRequest(to: string, from: string) {
        const targetedUser = await this.getUserByID(to);
        const sender = await this.getUserByID(from);

        // "from" and "to" is already validated in this.getUser
        const incomingFriendRequestID = targetedUser.incomingFriendRequests.indexOf(from as any);
        const outcomingFriendRequestID = sender.outcomingFriendRequests.indexOf(to as any);

        if (incomingFriendRequestID === -1) {
            throw new HTTPError(404, "Не удалось найти заявку в друзья");
        }

        targetedUser.incomingFriendRequests.splice(incomingFriendRequestID, 1);
        sender.outcomingFriendRequests.splice(outcomingFriendRequestID, 1);

        await targetedUser.save();
        await sender.save();
    }

    /**
     * In DB friend requests is just array of users id.
     *
     * This method return base info about users who sent/receive (depends on first argument)
     * friend requests to/from user with id equal to second argument of this method.
     */
    public async getParsedUserFriendRequests(requestsType: "outcoming" | "incoming", userId: string) {
        const user = await this.getUserByID(userId);

        const rawResult = await userModel.find({
            _id: { $in: requestsType === "outcoming" ? user.outcomingFriendRequests : user.incomingFriendRequests },
        });

        return rawResult.map((user) => this.getBaseUserInfo(user));
    }

    public async getParsedUserFriends(userId: string) {
        const user = await this.getUserByID(userId);

        const rawResult = await userModel.find({ _id: { $in: user.friends } });

        return rawResult.map((user) => this.getBaseUserInfo(user));
    }
}

export default new UserService();
