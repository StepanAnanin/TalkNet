import type AnyEvent from "../../types/WebSocket/Events";
import type ValidationResult from "../../types/lib/ValidationResult";

export default function validateEvent(event: AnyEvent): ValidationResult {
    const result: ValidationResult = { ok: true, message: null };

    const eventProperties = [
        { key: "accessToken", type: "string" },
        { key: "userID", type: "string" },
        { key: "chatID", type: "string" },
        { key: "event", type: "string" },
        { key: "payload", type: "object" },
    ];

    if (Object.keys(event).length !== 5) {
        result.ok = false;
        result.message = `Expected 5 properties on Event object, but got ${Object.keys(event).length}`;
        return result;
    }

    for (const property of eventProperties) {
        // @ts-ignore
        const eventPropertyValue = event[property.key];

        if (eventPropertyValue === undefined) {
            result.ok = false;
            result.message = `Property ${property.key} is missing`;
            return result;
        }

        if (typeof eventPropertyValue !== property.type) {
            result.ok = false;
            result.message = `Property ${property.key} has incorrect type`;
            return result;
        }
    }

    return result;
}
