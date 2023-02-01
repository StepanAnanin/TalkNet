import { Document } from "mongoose";

export default interface IUser extends Document {
    // ========== Main Properties ==========

    userName: string;
    email: string;
    password: string;
    isActivated: boolean;
    accessLevel: number;

    // ========== Secondary Properties ==========

    lastPasswordChange: number;
    activationLink: string | null;
    emailChangeCode: {
        value: number;
        expirationDate: number;
    } | null;
    accountDeleteLink: {
        value: string;
        expirationDate: number;
    } | null;
}
