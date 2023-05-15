import type DialogueChat from "../../../shared/types/features/DialogueChat";

export default function getIsUserHasAccessToChat(userChats: DialogueChat[], currentChatID: string) {
    for (const chat of userChats) {
        if (chat.id === currentChatID) {
            return true;
        }
    }

    return false;
}
