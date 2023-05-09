import { Types } from "mongoose";

export default interface ChatMessage {
    _id: string;
    sentBy: Types.ObjectId;
    data: string;
    // attachments: attacment[] // Not implemented
    sentDate: number;
    readDate: number | null; // from this property can be defined was message read or not
    edited: boolean;
}
