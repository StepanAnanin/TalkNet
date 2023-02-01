import type HTTPErrorCode from "../types/HTTPErrorCode";

export default class HTTPError extends Error {
    public errorCode: HTTPErrorCode;

    constructor(errorCode: HTTPErrorCode, message: string) {
        super(message);

        this.errorCode = errorCode;
    }
}
