export default interface IChatMessage {
    _id: string;
    sentBy: string;
    data: string;
    sentDate: number;
    readDate: number | null;
    edited: boolean;
}
