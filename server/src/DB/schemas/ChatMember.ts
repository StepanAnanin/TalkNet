import mongoose, { Schema } from "mongoose";
import IChat from "../../types/DB/models/Chat";
import chatMember from "../../types/DB/schemas/ChatMember";
import UserChatSettingsSchema from "./UserChatSettings";

const ChatMemberSchema = new mongoose.Schema<chatMember>({
    userID: { type: Schema.Types.ObjectId, required: true },
    fullUserName: { type: String, required: true },
    lastReadMessageIndex: { type: Number, default: 0 },
    userChatSettings: { type: UserChatSettingsSchema, default: {} },
});

export default ChatMemberSchema;
