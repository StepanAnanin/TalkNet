import "./NavigatorExplorer.scss";
import React from "react";

import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../../../types/ExplorerTarget";

import Chats from "../Chats";
import SearchTarget from "../SearchTarget";
import { useTypedSelector } from "../../../../../../shared/model/hooks/useTypedSelector";
import { DefaultLoader } from "../../../../../../shared/UI/Loader";

interface NavigatorExplorerProps extends UiComponentProps<HTMLDivElement> {
    target: ExplorerTarget;
}

export default function NavigatorExplorer(props: NavigatorExplorerProps) {
    const { className = "", target, ...otherProps } = props;

    const auth = useTypedSelector((state) => state.auth);

    if (!auth.user && (auth.request.status === "pending" || auth.request.status === "idle")) {
        return <DefaultLoader style={{ textAlign: "center", marginTop: "50px", marginInline: "auto" }} />;
    }

    const classes = ["TNUI-NavigatorExplorer", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {target === "chats" && <Chats />}
            {target === "search" && (
                <>
                    <SearchTarget target="users" />
                    <SearchTarget target="communities" />
                    <SearchTarget target="chats" />
                </>
            )}
        </div>
    );
}
