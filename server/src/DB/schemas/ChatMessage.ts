import mongoose, { Schema } from "mongoose";
import IChatMessage from "../../types/DB/schemas/ChatMessage";

const ChatMessageSchema = new mongoose.Schema<IChatMessage>({
    sentBy: { type: Schema.Types.ObjectId, required: true },
    data: { type: String, required: true },
    sentDate: { type: Number, default: Date.now() },
    readDate: { type: Number },
    edited: { type: Boolean, default: false },
});

export default ChatMessageSchema;
