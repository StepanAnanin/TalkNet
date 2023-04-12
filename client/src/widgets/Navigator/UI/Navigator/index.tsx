import "./Navigator.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../types/ExplorerTarget";

import NavigatorExplorer from "../NavigatorExplorer";
import NavigatorHeader from "../NavigatorHeader";
import { useLocation } from "react-router-dom";

interface NavigatorProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function Navigator(props: NavigatorProps) {
    const { className = "", ...otherProps } = props;

    const location = useLocation();

    let explorerTarget: ExplorerTarget | null = null;

    switch (location.pathname) {
        case "/m":
            explorerTarget = "chat";
            break;
        case "/communities":
            explorerTarget = "communities";
            break;
        case "/friends":
            explorerTarget = "friends";
            break;
        case "/settings":
            explorerTarget = "settings";
            break;
        default:
            break;
    }

    if (!explorerTarget) {
        throw new Error("Invalid explorer target");
    }

    const classes = ["TNUI-Navigator", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <NavigatorHeader addButtonLabel={explorerTarget !== "settings" ? "Добавить" : undefined} />
            <NavigatorExplorer target={explorerTarget} />
        </div>
    );
}
