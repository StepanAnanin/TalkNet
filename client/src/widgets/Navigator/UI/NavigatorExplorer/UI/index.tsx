import "./NavigatorExplorer.scss";
import React from "react";

import type { UiComponentProps } from "../../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../../types/ExplorerTarget";

import Chats from "./Chats";

interface NavigatorExplorerProps extends UiComponentProps<HTMLDivElement> {
    target: ExplorerTarget;
}

export default function NavigatorExplorer(props: NavigatorExplorerProps) {
    const { className = "", target, ...otherProps } = props;

    const classes = ["TNUI-NavigatorExplorer", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {target === "chat" && <Chats />}
        </div>
    );
}
