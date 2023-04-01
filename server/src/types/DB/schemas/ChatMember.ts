import type { Types } from "mongoose";
import UserChatSettings from "./UserChatSettings";

export default interface ChatMember {
    userID: Types.ObjectId;
    fullUserName: string;
    lastReadMessageIndex: number;
    userChatSettings: UserChatSettings;
}
