import type validationResult from "../../types/common/validationResult";

import RegExps from "../regexps";

export default function validateEmail(email: string): validationResult {
    if (!email.replaceAll(" ", "")) {
        return { OK: false, message: "Введите E-Mail" };
    }

    if (!RegExps.isEmail.test(email)) {
        return { OK: false, message: "E-Mail имеет недопустимый формат" };
    }

    return {
        OK: true,
        message: null,
    };
}
