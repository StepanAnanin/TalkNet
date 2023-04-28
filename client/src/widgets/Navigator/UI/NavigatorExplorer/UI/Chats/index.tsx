import "./Chats.scss";
import React from "react";

import NoChatsAlert from "@mui/icons-material/CommentsDisabledRounded";

import { useTypedSelector } from "../../../../../../shared/model/hooks/useTypedSelector";
import ChatPreview from "../ChatPreview";
import { useChat } from "../../../../../../entities/Chat";
import { NavigatorExplorerItemSkeleton } from "../../../../../../features/NavigatorExplorerItem";

export default function Chats() {
    const { user } = useTypedSelector((state) => state.auth);
    const { userChats, isChatsConnectionEstablised, getCurrentChatID } = useChat();
    const currentChatID = getCurrentChatID();

    // BUG not working
    // const parsedUserChats = React.useMemo(() => {
    //     if (!userChats || !user) {
    //         return null;
    //     }

    //     return userChats.map((chat) => {
    //         const interluctor = chat.members.find((member) => member.userID !== user.id)!;
    //         const userChatMember = chat.members.find((member) => member !== interluctor)!;

    //         return {
    //             active: chat.id === currentChatID,
    //             chatName: interluctor.fullUserName,
    //             lastReadMessageIndex: userChatMember.lastReadMessageIndex,
    //             chat,
    //         };
    //     });
    // }, [userChats, currentChatID]);

    if (!user) {
        throw new Error(`Необходима авторизация`);
    }

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
            {/* Not working */}
            {/* {parsedUserChats.map((parsedChat) => {
                return (
                    <MemoChatPreview
                        key={parsedChat.chat.id}
                        active={parsedChat.active}
                        chatName={parsedChat.chatName}
                        lastReadMessageIndex={parsedChat.lastReadMessageIndex}
                        imgURL=""
                        chat={parsedChat.chat}
                    />
                );
            })} */}
        </>
    );
}
