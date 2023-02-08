import { Document, Schema } from "mongoose";

export default interface IToken extends Document {
    user: Schema.Types.ObjectId;
    refreshToken: string;
}
