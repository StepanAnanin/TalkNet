import "./Menu.scss";
import React from "react";

import type { UiComponentProps } from "../../types/UI/UiComponentProps";

import Paper from "../Paper";

// It's dependecy for MenuItem props
export type MenuTextColour = "white" | "black" | "primary";

interface MenuProps extends UiComponentProps<HTMLUListElement> {
    colourScheme?: MenuTextColour;
}

export default React.forwardRef((props: MenuProps, ref: React.ForwardedRef<HTMLUListElement>) => {
    const { className = "", colourScheme = "white", children, ...otherProps } = props;

    const classes = ["TNUI-Menu", "TNUI-Menu-colour-scheme-" + colourScheme, className].join(" ");

    return (
        <ul ref={ref} className={classes} {...otherProps}>
            <div className="TNUI-Menu-wrapper">{children}</div>
        </ul>
    );
});
