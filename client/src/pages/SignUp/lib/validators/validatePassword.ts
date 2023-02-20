import type validationResult from "../../../../shared/types/common/validationResult";

import RegExps from "../../../../shared/lib/regexps";

export default function validatePassword(password: string): validationResult {
    if (!password.replaceAll(" ", "")) {
        return { OK: false, message: "Введите пароль" };
    }

    if (password.length < 6) {
        return {
            OK: false,
            message: "Пароль слишком короткий",
        };
    }

    if (password.length > 32) {
        return {
            OK: false,
            message: "Пароль слишком длинный",
        };
    }

    if (!RegExps.isPassword.test(password)) {
        return {
            OK: false,
            message: "Пароль содержит недопустимые символы",
        };
    }

    return {
        OK: true,
        message: null,
    };
}
