import type IUser from "../../types/DB/models/User";

import { Schema, model } from "mongoose";
import ActivationState from "../schemas/ActivationState";
import InitializeblePropertyState from "../schemas/InitializeblePropertyState";

const UserSchema = new Schema<IUser>({
    // ========== Main Properties ==========

    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    accessLevel: { type: Number, default: 5, required: true },
    activationState: { type: ActivationState, required: true },

    // ========== Secondary Properties ==========

    lastPasswordChange: { type: Number, default: Date.now(), required: true },
    emailChangeState: { type: InitializeblePropertyState, default: { isInitialized: false, link: null }, required: true },
    accountDeletionState: {
        type: InitializeblePropertyState,
        default: { isInitialized: false, link: null },
        required: true,
    },
});

export default model<IUser>(`User`, UserSchema);
