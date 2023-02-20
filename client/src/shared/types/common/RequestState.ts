export type RequestStateStatus = "idle" | "pending" | "succeeded" | "failed";

export interface RequestState {
    status: RequestStateStatus;
    message: string | null;
}
