import "./Navigator.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import NavigatorExplorer from "../NavigatorExplorer";
import NavigatorHeader from "../NavigatorHeader";

interface NavigatorProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function Navigator(props: NavigatorProps) {
    const { className = "", ...otherProps } = props;

    const classes = ["TNUI-Navigator", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <NavigatorHeader />
            <NavigatorExplorer />
        </div>
    );
}
