import "./Navigator.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../types/ExplorerTarget";

import NavigatorExplorer from "../NavigatorExplorer";
import NavigatorHeader from "../NavigatorHeader";
import { useLocation } from "react-router-dom";

interface NavigatorProps extends UiComponentProps<HTMLDivElement> {
    hideAddButton?: boolean;
}

const prevTargetRef: { current: ExplorerTarget | null } = { current: null };

export default function Navigator(props: NavigatorProps) {
    const { className = "", hideAddButton = false, ...otherProps } = props;

    const location = useLocation();
    const locationPathnameRoot = location.pathname.split("/")[1];

    /** Used in setting and search pages */

    let explorerTarget: ExplorerTarget | null = null;

    switch (locationPathnameRoot) {
        case "m":
            explorerTarget = "chat";
            prevTargetRef.current = explorerTarget;
            break;
        case "communities":
            explorerTarget = "communities";
            prevTargetRef.current = explorerTarget;
            break;
        case "friends":
            explorerTarget = "friends";
            prevTargetRef.current = explorerTarget;
            break;
        case "search":
            explorerTarget = "search";
            break;
        case "settings":
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
            <NavigatorHeader target={explorerTarget} hideAddButton={hideAddButton} />
            <NavigatorExplorer target={prevTargetRef.current ?? "chat"} />
        </div>
    );
}
