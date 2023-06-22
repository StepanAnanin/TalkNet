import type IUser from "../types/DB/models/User";

import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { v4 as uuid } from "uuid";
import UserModel from "../DB/models/User";
import bcrypt from "bcryptjs";
import EMailService from "./email-service";
import TokenService from "./token-service";
import config from "../config";
import HTTPError from "../errors/HTTPError";
import UserExplorer from "../lib/user-explorer";

import multer from "multer";

/**
 * @IMPORTANT Right now user can login in system only from 1 device at once
 */

// TODO require decomposition.
// (Maybee move all method that change user properties to new class — UserTuner/UserConfigurator)
class UserService {
    public async registrate(name: string, surname: string, patronymic: string | null, email: string, password: string) {
        if (await UserModel.findOne({ email })) {
            throw new HTTPError(409, `Пользователь с адресом электронной почты ${email} уже зарегестрирован.`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = uuid();

        const user = await UserModel.create({
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

            await UserModel.deleteOne({ email, password: hashedPassword });

            throw new Error(`Не удалось создать папку с статичными данными пользователя`);
        }

        try {
            await EMailService.sendActivationEMail(email, config.API_URL + "/user/activate/" + activationLink);
        } catch (err) {
            console.error(err);

            await UserModel.deleteOne({ email, password: hashedPassword });

            throw new Error(`Не удалось отправить электронное письмо с ссылкой для активации аккаунта.`);
        }

        const userDTO = UserExplorer.createUserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDTO });

        await TokenService.saveRefreshTokenToDB(user._id, tokens.refreshToken);

        console.log("\x1b[45m", `New user was created; id: ${user._id}, E-Mail: ${user.email}`, "\x1b[0m");

        return { user: userDTO };
    }

    public async login(email: string, password: string) {
        const user = await UserModel.findOne({ email });

        if (!user || !(await UserExplorer.verifyAuth(user, password))) {
            throw new HTTPError(400, `Неверный EMail или пароль`);
        }

        if (user.accessLevel === config.USER_ACCESS_LEVELS.bannedUser) {
            throw new HTTPError(403, "Данный аккаунт заблокирован");
        }

        const userDTO = UserExplorer.createUserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDTO });

        await TokenService.saveRefreshTokenToDB(user._id, tokens.refreshToken);

        console.log(`User ${user._id} logged in`);

        return { ...tokens, user: userDTO };
    }

    public async logout(refreshToken: string) {
        const token = await TokenService.removeToken(refreshToken);

        return token;
    }

    public async updateRefreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new Error(`Refresh token is missing`);
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await TokenService.findToken(refreshToken);

        if (!userData || !tokenFromDB) {
            throw new HTTPError(401, `User isn't authenticated`);
        }

        const user = (await UserModel.findOne({ email: userData.email }))!;

        const userDTO = UserExplorer.createUserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDTO });

        await TokenService.saveRefreshTokenToDB(user._id, tokens.refreshToken);

        return { ...tokens, user: userDTO };
    }

    public async activateAccount(activationLink: string) {
        const user = await UserModel.findOne({ "activationState.link": activationLink });

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
        const user = await UserModel.findOne({ email });

        if (!user || !(await UserExplorer.verifyAuth(user, currentPassword))) {
            throw new HTTPError(400, `Неверный EMail или пароль`);
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.settings.lastPasswordChange = Date.now();

        await user!.save();
    }

    public async changeEmail(currentEmail: string, newEmail: string, password: string) {
        const user = await UserModel.findOne({ email: currentEmail });

        if (!user || !(await UserExplorer.verifyAuth(user, password))) {
            throw new HTTPError(400, `Неверный EMail или пароль`);
        }

        const userWithNewEmail = await UserModel.findOne({ email: newEmail });

        if (userWithNewEmail) {
            throw new HTTPError(409, "Пользователь с таким E-Mail'ом уже существует");
        }

        const activationLink = uuid();

        user.activationState.isActivated = false;
        user.activationState.link = activationLink;

        try {
            await EMailService.sendActivationEMail(newEmail, config.API_URL + "/user/activate/" + activationLink);
        } catch (err) {
            console.error(err);

            user.activationState.isActivated = true;
            user.activationState.link = null;

            throw new Error(`Не удалось отправить электронное письмо с ссылкой для активации аккаунта.`);
        }

        user.email = newEmail;

        await user.save();
    }

    public async changeFullname(userID: string, name: string, surname: string, patronymic: string | null) {
        const user = await UserModel.findById(userID);

        if (!user) {
            throw new HTTPError(500, `Не удалось получить информацию о пользователе`);
        }

        user.name = name;
        user.surname = surname;
        user.patronymic = patronymic;

        await user.save();
    }

    public async changeUserName(email: string, password: string, newUsername: string) {
        throw new Error(`Not implemented`);
    }

    public async configureAvatarUploader(userID: string) {
        if (!userID) {
            throw new Error("configureAvatarUploader: Missing userID argument");
        }

        const fileStorageEngine = multer.diskStorage({
            destination: async (request, file, callback) => {
                let error: null | Error = null;

                if (typeof userID !== "string") {
                    callback(new Error(`Не удалось получить данные пользователя`), "");
                    return;
                }

                const avatarUploadAbsolutePath = path.join(config.ROOT_PATH, "static", "user", userID);

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
                callback(null, "avatar.png");
            },
        });

        const upload = multer({ storage: fileStorageEngine });

        return upload.single("selected-avatar");
    }

    public async sendFriendRequest(to: string, from: string) {
        const targetedUser = await UserExplorer.getUserByID(to);
        const sender = await UserExplorer.getUserByID(from);

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
        const targetedUser = await UserExplorer.getUserByID(to);
        const sender = await UserExplorer.getUserByID(from);

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
        const targetedUser = await UserExplorer.getUserByID(to);
        const sender = await UserExplorer.getUserByID(from);

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

    public async deleteFriend(userID: string, friendID: string) {
        const user = await UserExplorer.getUserByID(userID);
        const friend = await UserExplorer.getUserByID(friendID);

        const userFriendIndex = user.friends.indexOf(friend._id);
        const friendUserIndex = friend.friends.indexOf(user._id);

        if (userFriendIndex === -1 || friendUserIndex === -1) {
            throw new HTTPError(404, "Пользователь не был найден в списке друзей");
        }

        user.friends.splice(userFriendIndex, 1);
        friend.friends.splice(friendUserIndex, 1);

        await user.save();
        await friend.save();
    }

    /**
     * In DB friend requests is just array of users id.
     *
     * This method return base info about users who sent/receive (depends on first argument)
     * friend requests to/from user with id equal to second argument of this method.
     */
    public async getParsedUserFriendRequests(requestsType: "outcoming" | "incoming", userId: string) {
        const user = await UserExplorer.getUserByID(userId);

        const rawResult = await UserModel.find({
            _id: { $in: requestsType === "outcoming" ? user.outcomingFriendRequests : user.incomingFriendRequests },
        });

        return rawResult.map((user) => UserExplorer.getBaseUserInfo(user));
    }

    public async getParsedUserFriends(userId: string) {
        const user = await UserExplorer.getUserByID(userId);

        const rawResult = await UserModel.find({ _id: { $in: user.friends } });

        return rawResult.map((user) => UserExplorer.getBaseUserInfo(user));
    }
}

export default new UserService();
