import { Document, Types } from "mongoose";

import type I_ActivationState from "../../../types/DB/schemas/ActivationState";
import type UserSettings from "../../../types/DB/schemas/UserSettings";
import type { UserAccessLevelValue } from "../../../types/UserAccessLevel";

export interface User {
    name: string;
    surname: string;
    patronymic: string | null;
    email: string;
    password: string;
    phoneNumber: number | null;
    accessLevel: UserAccessLevelValue;
    activationState: I_ActivationState;
    friends: Types.Array<Types.ObjectId>;
    incomingFriendRequests: Types.Array<Types.ObjectId>;
    outcomingFriendRequests: Types.Array<Types.ObjectId>;
    blackList: Types.Array<Types.ObjectId>;
    settings: UserSettings;
}

type IUser = User & Document;

export default IUser;
