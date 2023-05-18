import "./Chats.scss";
import React from "react";

import NoChatsAlert from "@mui/icons-material/CommentsDisabledRounded";

import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import ChatPreview from "../ChatPreview";
import { NavigatorExplorerItemSkeleton } from "../NavigatorExplorerItem";
import { useSearchParams } from "react-router-dom";
import useChats from "../../model/hooks/useChats";

export default function Chats() {
    const { auth } = useTypedSelector((state) => state);
    const user = auth.payload;

    if (!user) {
        throw new Error(`Необходима авторизация`);
    }

    const userChats = useChats();

    const [searchParams] = useSearchParams();
    const currentChatID = searchParams.get("chat");

    if (!userChats) {
        return (
            <>
                <NavigatorExplorerItemSkeleton />
                <NavigatorExplorerItemSkeleton />
                <NavigatorExplorerItemSkeleton />
                <NavigatorExplorerItemSkeleton />
                <NavigatorExplorerItemSkeleton />
                <NavigatorExplorerItemSkeleton />
                <NavigatorExplorerItemSkeleton />
            </>
        );
    }

    return (
        <>
            {userChats.length === 0 && (
                <div className="TNUI-Chats-empty-chat-list-alert">
                    <NoChatsAlert className="TNUI-Chats-empty-chat-list-alert_icon" />{" "}
                    <span className="TNUI-Chats-empty-chat-list-alert_label">У вас нет сообщений</span>
                </div>
            )}
            {userChats.map((chat) => {
                const interlocutor = chat.members.find((member) => member.userID !== user.id)!;
                const userChatMember = chat.members.find((member) => member.userID !== interlocutor.userID)!;

                return (
                    <ChatPreview
                        active={chat.id === currentChatID}
                        key={chat.id}
                        interlocutorID={interlocutor.userID}
                        chat={chat}
                        chatName={interlocutor.fullUserName}
                        lastReadMessageIndex={userChatMember.lastReadMessageIndex}
                    />
                );
            })}
        </>
    );
}
