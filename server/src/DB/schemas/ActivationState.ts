import mongoose from "mongoose";

import type IActivationState from "../../types/DB/schemas/ActivationState";

const ActivationStateSchema = new mongoose.Schema<IActivationState>({
    isActivated: Boolean,
    link: String,
});

export default ActivationStateSchema;
