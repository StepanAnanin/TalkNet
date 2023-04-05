import DialogueChatMessage from "../shared/DialogueChatMessage";

export default interface DialogueChat {
    id: string;
    type: "dialogue";
    lastMessage: DialogueChatMessage;
    messageAmount: number;
    members: [DialogueChatMember, DialogueChatMember];
}

export interface DialogueChatMember {
    _id: string;
    userID: string;
    fullUserName: string;
    lastReadMessageIndex: number;
    userChatSettings: {
        _id: string;
        muted: boolean;
    };
}
