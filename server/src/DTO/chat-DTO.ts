import ChatMember from "../types/DB/schemas/ChatMember";
import ChatMessage from "../types/DB/schemas/ChatMessage";
import { ChatType } from "./../types/DB/models/Chat";

type constructorModel = {
    id: string;
    type: ChatType;
    members: ChatMember[];
    lastMessage: ChatMessage | null;
    messageAmount: number;
};

export default class ChatDTO {
    public id: string;
    public type: ChatType;
    public members: ChatMember[];
    public lastMessage: ChatMessage | null;
    public messageAmount: number;

    constructor(model: constructorModel) {
        this.id = model.id;
        this.type = model.type;
        this.members = model.members;
        this.lastMessage = model.lastMessage;
        this.messageAmount = model.messageAmount;
    }
}
