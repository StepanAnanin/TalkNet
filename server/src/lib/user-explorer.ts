import type IUser from "../types/DB/models/User";

import userModel from "../DB/models/User";
import bcrypt from "bcrypt";
import UserDTO from "../DTO/user-DTO";
import HTTPError from "../errors/HTTPError";

import tokenModel from "../DB/models/Token";
import { ObjectId } from "mongodb";
import config from "../config";

/**
 * This class provide methods for searching user by certain properties or methods to search this properties.
 * Also provides method to parse data about user in specific formats.
 */
class UserExplorer {
    public createUserDTO(user: IUser) {
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

    /**
     * Base info are full user name (name, surname, patronymic) and his id.
     */
    public getBaseUserInfo(user: IUser) {
        return {
            id: user._id,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
        };
    }

    public async getUserByID(userID: string) {
        if (!ObjectId.isValid(userID)) {
            throw new HTTPError(400, "User ID has incorrect format");
        }

        const user = await userModel.findById(userID);

        if (!user) {
            throw new HTTPError(404, "User wasn't found");
        }

        return user;
    }

    public async verifyAuth(user: IUser, password: string) {
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

    public async isUserBanned(userId: string) {
        const user = await this.getUserByID(userId);

        return user.accessLevel === config.USER_ACCESS_LEVELS.bannedUser;
    }
}

export default new UserExplorer();
