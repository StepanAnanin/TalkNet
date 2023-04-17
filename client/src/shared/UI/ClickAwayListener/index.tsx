import type { UiComponentProps } from "../../types/UI/UiComponentProps";

import React from "react";

interface ClickAwayListenerProps extends Omit<UiComponentProps<HTMLDivElement>, "ref"> {
    onClickAway: (e: MouseEvent) => void;
    children: React.ReactNode;
}

/**
 * Can be used as default `div` element.
 */
export default function ClickAwayListener(props: ClickAwayListenerProps) {
    const { onClickAway, children, ...otherProps } = props;
    const targetedElementRef = React.useRef<HTMLDivElement | null>(null);

    function clickAwayHandler(e: MouseEvent) {
        const element = targetedElementRef.current;

        if (!element) {
            throw new Error(`ClickAwayListener: Targeted element wasn't found`);
        }

        const elementPos = element.getBoundingClientRect();

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#return_value
        const clickPos = { x: e.clientX, y: e.clientY };
        const elemBottomRight = { x: elementPos.right, y: elementPos.bottom };
        const elemTopLeft = { x: elementPos.x, y: elementPos.y };

        // To understand is user clicked on element need to click coords be more than coords of
        // top left corner of the element and less than coords of bottom right corner of the element.
        // When this condition fails that means user clicked away from targeted element.
        const isClickedOnElement =
            clickPos.x > elemTopLeft.x &&
            clickPos.y > elemTopLeft.y &&
            clickPos.x < elemBottomRight.x &&
            clickPos.y < elemBottomRight.y;

        if (!isClickedOnElement) {
            onClickAway(e);
        }
    }

    React.useEffect(() => {
        // This timeout need to correct work for some components that closes on clicking away, like AvatarMenu.
        // Without this timeout that components will be closed immediately after opening.
        // Thats happen because this components open on clicking parent element, which is in fact also
        // clicking away from targeted element for ClickAwayListener and this calling clickAwayHandler.
        // This timeout prevent this behavior and not ruins work for all other components which isn't working like that.
        setTimeout(() => {
            document.addEventListener("mousedown", clickAwayHandler);
        }, 5);

        return function () {
            document.removeEventListener("mousedown", clickAwayHandler);
        };
    }, []);

    return (
        <div ref={targetedElementRef} {...otherProps}>
            {children}
        </div>
    );
}
