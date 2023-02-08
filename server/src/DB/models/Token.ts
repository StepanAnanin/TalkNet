import type IToken from "../../types/DB/models/Token";

import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: `User`, require: true },
    refreshToken: { type: String, require: true },
});

export default model<IToken>(`Token`, TokenSchema);
