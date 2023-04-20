import type DefaultTypes from "../../types/DefaultTypes";
import type ValidationResult from "../../types/lib/ValidationResult";

interface ExpectedProperty {
    key: string;
    type: DefaultTypes | DefaultTypes[];
    notRequired?: boolean;
    exact?: boolean;
}

/**
 * Now works only with default data types
 */
export default function validateRequest(target: unknown, expectedProperties: ExpectedProperty[]) {
    if (!target || typeof target !== "object") {
        throw new TypeError(`target must be an object`);
    }

    const result: ValidationResult = { ok: true, message: null };

    for (const property of expectedProperties) {
        // @ts-ignore
        const propertyValue = target[property.key];
        const propertyType = typeof propertyValue;
        const requestedPropertyType = property.type;

        // If not required property is skipped
        if (property.notRequired && propertyValue === undefined) {
            continue;
        }

        if (propertyValue && property.exact) {
            if (Array.isArray(requestedPropertyType) && !requestedPropertyType.includes(propertyType)) {
                result.ok = false;
                result.message = `Property '${property.key}' has incorrect data type.`;
                break;
            } else if (requestedPropertyType !== propertyType) {
                result.ok = false;
                result.message = `Property '${property.key}' has incorrect data type.`;
                break;
            }
        }

        if (!propertyValue && property.exact) {
            continue;
        }

        // If property isn't exist
        if (propertyValue === undefined) {
            result.ok = false;
            result.message = `Property '${property.key}' is missing.`;
            break;
        }

        // If passed an empty string;
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
