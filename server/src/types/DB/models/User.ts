import { Document } from "mongoose";

import type I_ActivationState from "../../../types/DB/schemas/ActivationState";
import type I_InitializeblePropertyState from "../../../types/DB/schemas/InitializeblePropertyState";
import type { UserAccessLevelValue } from "../../../types/UserAccessLevel";

export default interface IUser extends Document {
    // ========== Main Properties ==========

    userName: string;
    email: string;
    password: string;
    activationState: I_ActivationState;
    accessLevel: UserAccessLevelValue;

    // ========== Secondary Properties ==========

    lastPasswordChange: number;
    emailChangeState: I_InitializeblePropertyState;
    accountDeletionState: I_InitializeblePropertyState;
}
