import type DefaultTypes from "../../types/DefaultTypes";
import type ValidationResult from "../../types/lib/ValidationResult";

interface ExpectedProperty {
    key: string;
    type: DefaultTypes | DefaultTypes[];
}

/**
 * Now works only with default data types
 */
export default function validateRequest(requestBody: unknown, expectedProperties: ExpectedProperty[]) {
    if (!requestBody || typeof requestBody !== "object") {
        throw new TypeError(`requestBody must be an object`);
    }

    const result: ValidationResult = { ok: true, message: null };

    for (const property of expectedProperties) {
        // @ts-ignore
        const propertyValue = requestBody[property.key];
        const propertyType = typeof propertyValue;

        // If property isn't exist
        if (propertyValue === undefined) {
            result.ok = false;
            result.message = `Property '${property.key}' is missing.`;
            break;
        }

        if (propertyType === "string" && !(propertyValue as string).replaceAll(" ", "")) {
            result.ok = false;
            result.message = `Property '${property.key}' has incorrect value.`;
            break;
        }

        // If property can be more than 2 types
        if (Array.isArray(property.type)) {
            if (!property.type.includes(propertyType)) {
                result.ok = false;
                result.message = `Property '${property.key}' has incorrect data type.`;
                break;
            }

            continue;
        }

        // If property can be only one exact type
        if (propertyType !== property.type) {
            result.ok = false;
            result.message = `Property '${property.key}' has incorrect data type.`;
            break;
        }
    }

    return result;
}
