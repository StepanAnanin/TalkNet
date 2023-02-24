import type validationResult from "../../types/common/validationResult";
import ValidationError from "../errors/ValidationError";

import RegExps from "../regexps";

export default function validateEmail(email: string): validationResult {
    const result: validationResult = { OK: true, message: null };

    try {
        if (!email.replaceAll(" ", "")) {
            throw new ValidationError("Введите E-Mail");
        }

        if (!RegExps.isEmail.test(email)) {
            throw new ValidationError("E-Mail имеет недопустимый формат");
        }
    } catch (err) {
        if (!(err instanceof ValidationError)) {
            throw err;
        }

        result.OK = false;
        result.message = err.message;
    }

    return result;
}
