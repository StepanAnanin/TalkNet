import type IUser from "../../types/DB/models/User";

import { Schema, model } from "mongoose";
import ActivationState from "../schemas/ActivationState";
import UserSettings from "../schemas/UserSettings";

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    patronymic: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, default: null },
    accessLevel: { type: Number, default: 5, required: true },
    activationState: { type: ActivationState, required: true },
    friends: [Schema.Types.ObjectId],
    friendRequests: [Schema.Types.ObjectId],
    blackList: [Schema.Types.ObjectId],
    settings: { type: UserSettings, default: {} },
});

const UserModel = model<IUser>(`User`, UserSchema);

export default UserModel;
