import { Document, Types } from "mongoose";

import type ChatMember from "../schemas/ChatMember";
import type ChatMessage from "../schemas/ChatMessage";

export type ChatType = "dialogue" | "group";

export default interface IChat extends Document {
    name: string;
    type: ChatType;
    members: Types.Array<ChatMember>;
    messages: Types.Array<ChatMessage>;
}
