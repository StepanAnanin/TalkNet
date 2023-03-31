import "./MessageInput.scss";
import React from "react";

import EmojiIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import TextField from "../../../../shared/UI/TextField";

interface MessageInputProps extends UiComponentProps<HTMLDivElement> {
    onSendButtonClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

// TODO add prop for message size limit
export default React.forwardRef(function MessageInput(props: MessageInputProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { className = "", onSendButtonClick, ...otherProps } = props;

    const classes = ["TNUI-MessageInput", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <TextField className="TNUI-MessageInput-input" wrapperClassName="TNUI-Message-input-wrapper" ref={ref}>
                <EmojiIcon className="TNUI-MessageInput-input_button" />
            </TextField>
            <SendIcon className="TNUI-MessageInput-send-button" onClick={onSendButtonClick} />
        </div>
    );
});
