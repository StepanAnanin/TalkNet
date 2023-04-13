export default interface ChatMessage {
    _id: string;
    sentBy: string;
    data: string;
    sentDate: number;
    readDate: number;
    edited: boolean;
}
