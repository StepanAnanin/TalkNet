import mongoose from "mongoose";
import IUserChatSettings from "../../types/DB/schemas/UserChatSettings";

const UserChatSettingsSchema = new mongoose.Schema<IUserChatSettings>({
    muted: { type: Boolean, default: false },
});

export default UserChatSettingsSchema;
