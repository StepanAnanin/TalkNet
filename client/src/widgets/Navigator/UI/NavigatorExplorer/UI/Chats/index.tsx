import React from "react";

import { useTypedSelector } from "../../../../../../shared/model/hooks/useTypedSelector";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import ChatPreview from "../../../../../../features/ChatPreview";
import DialogueChat from "../../../../../../shared/types/features/DialogueChat";
import { useLocation } from "react-router-dom";
import ChatPreviewSkeleton from "../../../../../../features/ChatPreview/UI/ChatPreviewSkeleton";

export default function Chats() {
    const { user } = useTypedSelector((state) => state.auth);
    const location = useLocation();

    const [userChats, setUserChats] = React.useState<DialogueChat[] | null>(null);
    const currentChatID = new URLSearchParams(location.search).get("chat");

    if (!user) {
        throw new Error(`Required Authorization`);
    }

    React.useEffect(() => {
        (async function () {
            const response = await TalkNetAPI.get(`/user/${user.id}/chats`);

            setUserChats(response.data);
        })();
    }, []);

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

                return (
                    <ChatPreview
                        active={chat.id === currentChatID}
                        key={chat.id}
                        imgURL=""
                        chatName={interluctor.fullUserName}
                        lastMessage={chat.lastMessage.data}
                    />
                );
            })}
        </>
    );
}
