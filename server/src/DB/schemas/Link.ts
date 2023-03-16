import mongoose from "mongoose";

import type I_Link from "../../types/DB/schemas/Link";

const LinkSchema = new mongoose.Schema<I_Link>({
    value: { type: String, required: true },
    expirationDate: { type: Number, required: true },
});

export default LinkSchema;
