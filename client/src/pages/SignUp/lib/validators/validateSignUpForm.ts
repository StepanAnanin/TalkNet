import type validationResult from "../../../../shared/types/common/validationResult";
import type { IinputIds } from "../../UI/UserRegistrationForm";

import validatePassword from "./validatePassword";
import ValidationError from "../../../../shared/lib/errors/ValidationError";
import validateEmail from "../../../../shared/lib/validators/validateEmail";

type Elements = {
    [key in keyof IinputIds]: HTMLInputElement;
};

export default function validateSignUpForm(inputIds: IinputIds): validationResult {
    const result: validationResult = { OK: true, message: null };

    // @ts-ignore
    const elements: Elements = { ...inputIds };

    // changing "elements" to match it's interface
    for (const key in elements) {
        const element = document.querySelector(`#${inputIds[key as keyof IinputIds]}`);

        if (!(element instanceof HTMLInputElement)) {
            throw new TypeError(
                `validateSignUpForm: Expected all elements to be inputs, but got ${Object.getPrototypeOf(element)}`
            );
        }

        elements[key as keyof Elements] = element;
    }

    try {
        // Checking is all required inputs filled
        for (const key in elements) {
            // surname is not required
            if (elements[key as keyof Elements].id === inputIds.surname) {
                continue;
            }

            if (!elements[key as keyof Elements].value.replaceAll(" ", "")) {
                throw new ValidationError("Не все обязательные поля были заполнены");
            }
        }

        // validating password and email
        const inputedPassword = elements.password.value;
        const inputedEmail = elements.email.value;
        const inputedPasswordRepeat = elements.passwordRepeat.value;

        const passwordValidationResult = validatePassword(inputedPassword);
        const emailValidationResult = validateEmail(inputedEmail);

        if (!passwordValidationResult.OK) {
            throw new ValidationError(passwordValidationResult.message!);
        }

        if (!emailValidationResult.OK) {
            throw new ValidationError(emailValidationResult.message!);
        }

        if (inputedPassword !== inputedPasswordRepeat) {
            throw new ValidationError(`Пароли не совпадают`);
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
