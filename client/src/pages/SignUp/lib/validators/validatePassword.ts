import type validationResult from "../../../../shared/types/common/validationResult";

import RegExps from "../../../../shared/lib/regexps";
import ValidationError from "../../../../shared/lib/errors/ValidationError";

export default function validatePassword(password: string): validationResult {
    const result: validationResult = { OK: true, message: null };

    try {
        if (!password.replaceAll(" ", "")) {
            throw new ValidationError("Введите пароль");
        }

        if (password.length < 6) {
            throw new ValidationError("Пароль слишком короткий");
        }

        if (password.length > 32) {
            throw new ValidationError("Пароль слишком длинный");
        }

        if (!RegExps.isPassword.test(password)) {
            throw new ValidationError("Пароль содержит недопустимые символы");
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
