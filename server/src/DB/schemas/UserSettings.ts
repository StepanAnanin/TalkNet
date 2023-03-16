import { Schema } from "mongoose";
import IUserSettings from "../../types/DB/schemas/UserSettings";
import InitializeblePropertyState from "../schemas/InitializeblePropertyState";

const UserSettingsSchema = new Schema<IUserSettings>({
    lastPasswordChange: { type: Number, default: Date.now() },
    emailChangeState: { type: InitializeblePropertyState, default: { isInitialized: false, link: null } },
    accountDeletionState: {
        type: InitializeblePropertyState,
        default: { isInitialized: false, link: null },
    },
});

export default UserSettingsSchema;
