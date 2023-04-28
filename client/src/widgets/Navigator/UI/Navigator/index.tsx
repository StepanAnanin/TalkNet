import "./Navigator.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../types/ExplorerTarget";

import NavigatorExplorer from "../NavigatorExplorer";
import NavigatorHeader from "../NavigatorHeader";
import { useSearchParams } from "react-router-dom";

interface NavigatorProps extends UiComponentProps<HTMLDivElement> {
    hideAddButton?: boolean;
}

export default function Navigator(props: NavigatorProps) {
    const { className = "", hideAddButton = false, ...otherProps } = props;

    const [searchParams, setSearchParams] = useSearchParams();
    const navigatorTargetState = React.useState<ExplorerTarget>((searchParams.get("nt") as ExplorerTarget) ?? "chats");

    const classes = ["TNUI-Navigator", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <NavigatorHeader targetState={navigatorTargetState} hideAddButton={hideAddButton} />
            <NavigatorExplorer target={navigatorTargetState[0]} />
        </div>
    );
}
