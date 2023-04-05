import React from "react";

import { useTypedSelector } from "../../../../../../shared/model/hooks/useTypedSelector";
import ChatPreview from "../../../../../../features/ChatPreview";
import { useLocation } from "react-router-dom";
import ChatPreviewSkeleton from "../../../../../../features/ChatPreview/UI/ChatPreviewSkeleton";
import { useChat } from "../../../../../../entities/Chat";

export default function Chats() {
    const { user } = useTypedSelector((state) => state.auth);
    const userChats = useChat();
    const location = useLocation();
    const currentChatID = new URLSearchParams(location.search).get("chat");

    if (!user) {
        throw new Error(`Необходима авторизация`);
    }

    if (!userChats) {
        return (
            <>
                <ChatPreviewSkeleton />
                <ChatPreviewSkeleton />
                <ChatPreviewSkeleton />
                <ChatPreviewSkeleton />
                <ChatPreviewSkeleton />
                <ChatPreviewSkeleton />
                <ChatPreviewSkeleton />
            </>
        );
    }

    return (
        <>
            {userChats.map((chat) => {
                const interluctor = chat.members.find((member) => member.userID !== user.id)!;
                const userChatMember = chat.members.find((member) => member !== interluctor)!;

                return (
                    <ChatPreview
                        active={chat.id === currentChatID}
                        key={chat.id}
                        imgURL=""
                        chat={chat}
                        chatName={interluctor.fullUserName}
                        lastReadMessageIndex={userChatMember.lastReadMessageIndex}
                    />
                );
            })}
        </>
    );
}
