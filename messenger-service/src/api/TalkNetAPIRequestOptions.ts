import config from "../config";
import { RequestOptions, OutgoingHttpHeaders } from "http";

type HTTPRequestMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

export default class TalkNetAPIRequestOptions implements RequestOptions {
    public readonly host = config.TALKNET_API_HOST;
    public readonly port = config.TALKNET_API_PORT;

    public readonly path: string;
    public readonly method: HTTPRequestMethod;

    public readonly headers: OutgoingHttpHeaders;

    constructor(path: string, method: HTTPRequestMethod, accessToken: string, headers?: OutgoingHttpHeaders) {
        this.path = path;
        this.method = method;
        this.headers = {
            "Content-Type": "application/json",
            authorization: "Bearer " + accessToken,
            ...headers,
        };
    }
}
