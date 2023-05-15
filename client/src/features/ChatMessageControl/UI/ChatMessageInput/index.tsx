import "./ChatMessageInput.scss";
import React from "react";

import EmojiIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type MessengerServiceEventModel from "../../../../shared/types/shared/lib/MessengerService/MessengerServiceModel";

import TextField from "../../../../shared/UI/TextField";
import { DefaultLoader } from "../../../../shared/UI/Loader";
import useMessengerService from "../../../../shared/model/hooks/useMessengerService";
import { MessengerServiceOutcomingEventResponse } from "../../../../shared/lib/MessengerService/MessengerServiceEvent";

interface MessageInputProps extends UiComponentProps<HTMLDivElement> {
    chatID: string;
    MessengerServiceConnection: ReturnType<typeof useMessengerService>;
}

// TODO add prop for message size limit
export function ChatMessageInput(props: MessageInputProps) {
    const { className = "", chatID, MessengerServiceConnection, ...otherProps } = props;

    const [isMessageSendInProgress, setIsMessageSendInProgress] = React.useState(false);

    const сhatMessageInputRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        function handleSendMessageResponse(
            e: MessengerServiceOutcomingEventResponse<MessengerServiceEventModel.OutcomingEvent.Response.Any>
        ) {
            const inputElement = сhatMessageInputRef.current;

            if (!(inputElement instanceof HTMLElement)) {
                throw new TypeError("Message input element has incorrect data type or doesn't exist");
            }

            setIsMessageSendInProgress(false);

            inputElement.innerText = "";
        }

        MessengerServiceConnection.addEventHandler("send-message", handleSendMessageResponse);

        return function () {
            MessengerServiceConnection.removeEventHandler("send-message", handleSendMessageResponse);
        };
    }, []);

    function sendMessage() {
        if (isMessageSendInProgress) {
            return;
        }

        const inputElement = сhatMessageInputRef.current;

        if (!(inputElement instanceof HTMLElement)) {
            throw new TypeError("Message input element has incorrect data type or doesn't exist");
        }

        const inputedMessage = inputElement.innerText;

        if (!inputedMessage.replaceAll(" ", "")) {
            return;
        }

        MessengerServiceConnection.dispathOutcomingEvent({
            name: "send-message",
            payload: { chatID: chatID!, message: inputedMessage, sentDate: Date.now() },
        });

        setIsMessageSendInProgress(true);
    }

    function inputKeyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.code === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            return;
        }

        props.onKeyDown && props.onKeyDown(e);
    }

    const classes = ["TNUI-ChatMessageInput", className].join(" ");

    return (
        <div className={classes} onKeyDown={inputKeyDownHandler} {...otherProps}>
            <TextField
                ref={сhatMessageInputRef}
                className="TNUI-ChatMessageInput-input"
                wrapperClassName="TNUI-Message-input-wrapper"
            >
                <EmojiIcon className="TNUI-ChatMessageInput-input_button" />
            </TextField>
            {isMessageSendInProgress ? (
                <DefaultLoader size="small" className="TNUI-ChatMessageInput-send-in-progress-indicator" />
            ) : (
                <SendIcon className="TNUI-ChatMessageInput-send-button" onClick={sendMessage} />
            )}
        </div>
    );
}

export const MemoChatMessageInput = React.memo(ChatMessageInput);
