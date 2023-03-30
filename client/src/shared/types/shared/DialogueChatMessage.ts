export default interface DialogueChatMessage {
    _id: string;
    sentBy: string;
    data: string;
    sentDate: number;
    readDate: number;
    edited: boolean;
}
