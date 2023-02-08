import mongoose from "mongoose";
import LinkSchema from "./Link";

import type I_InitializeblePropertyState from "../../types/DB/schemas/InitializeblePropertyState";

const InitializeblePropertyState = new mongoose.Schema<I_InitializeblePropertyState>({
    isInitialized: { type: Boolean, default: false, required: true },
    link: {
        type: LinkSchema,
    },
});

export default InitializeblePropertyState;
