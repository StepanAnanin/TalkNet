import "./MessageInput.scss";
import React from "react";

import EmojiIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import TextInput from "../../../../shared/UI/TextInput";
import TextField from "../../../../shared/UI/TextField";

interface MessageInputProps extends UiComponentProps<HTMLDivElement> {
    onSendButtonClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

// BUG now has incorrect behavior. Should act like text area html tag, not like input
export default React.forwardRef(function MessageInput(props: MessageInputProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { className = "", onSendButtonClick, ...otherProps } = props;

    const classes = ["TNUI-MessageInput", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <TextField className="TNUI-MessageInput-input" ref={ref}>
                <EmojiIcon className="TNUI-MessageInput-input_button" />
            </TextField>
            <SendIcon className="TNUI-MessageInput-send-button" onClick={onSendButtonClick} />
        </div>
    );
});
