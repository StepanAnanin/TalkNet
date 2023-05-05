export default interface ChangeRequest {
    message: string | null;
    status: "Pending" | "Error" | "Warning" | "Success";
}
