import { Document, Types } from "mongoose";

import type I_ActivationState from "../../../types/DB/schemas/ActivationState";
import type UserSettings from "../../../types/DB/schemas/UserSettings";
import type { UserAccessLevelValue } from "../../../types/UserAccessLevel";

export default interface IUser extends Document {
    name: string;
    surname: string;
    patronymic: string | null;
    email: string;
    password: string;
    phoneNumber: number | null;
    accessLevel: UserAccessLevelValue;
    activationState: I_ActivationState;
    friends: Types.Array<Types.ObjectId>;
    friendRequests: Types.Array<Types.ObjectId>;
    blackList: Types.Array<Types.ObjectId>;
    settings: UserSettings;
}
