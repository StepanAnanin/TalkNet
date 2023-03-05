import "./TextField.scss";
import React from "react";

import type { UiComponentProps } from "../../types/UI/UiComponentProps";

interface TextFieldProps extends Omit<Omit<UiComponentProps<HTMLDivElement>, "role">, "contentEditable"> {
    wrapperClassName?: string;
}

/**
 * To restrict this element max height on auto resizing just set property `max-height`.
 */
export default React.forwardRef(function TextField(props: TextFieldProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { className = "", wrapperClassName = "", defaultValue, onPaste, children, ...otherProps } = props;

    const classes = ["TNUI-TextField", className].join(" ");
    const wrapperClasses = ["TNUI-TextField-wrapper", wrapperClassName].join(" ");

    /*
        This function overrides default paste behavior, this is required cuz by default
        on copy/paste text his styles also are coping/pasting, this function fixing it.

        docs: https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
    */
    function onPasteHandler(e: React.ClipboardEvent<HTMLDivElement>) {
        e.preventDefault();

        const pastedText = e.clipboardData.getData("text");

        const selection = window.getSelection();

        if (!selection || !selection.rangeCount) {
            return;
        }

        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(pastedText));
        selection.collapseToEnd();

        onPaste && onPaste(e);
    }

    function onWrapperClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const wrapperElement = e.currentTarget;
        const textFieldElement = wrapperElement.querySelector<HTMLDivElement>(".TNUI-TextField")!;

        textFieldElement.focus();
    }

    return (
        <div className={wrapperClasses} onClick={onWrapperClick} ref={ref}>
            <div className={classes} onPaste={onPasteHandler} {...otherProps} role="textbox" contentEditable>
                {defaultValue}
            </div>
            {children}
        </div>
    );
});
