export default class ValidationError extends Error {
    constructor(message: string, options?: ErrorOptions | undefined) {
        super(message, options);
    }
}
