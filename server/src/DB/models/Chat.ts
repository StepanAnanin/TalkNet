import type IChat from "../../types/DB/models/Chat";

import { Model, Schema, model } from "mongoose";
import ChatMemberSchema from "../schemas/ChatMember";
import ChatMessageSchema from "../schemas/ChatMessage";

const ChatSchema = new Schema<IChat, Model<IChat>>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    members: [ChatMemberSchema],
    messages: [ChatMessageSchema],
});

export default model<IChat>(`Chat`, ChatSchema);
