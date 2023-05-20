import "./NavigatorExplorer.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../types/ExplorerTarget";

import Chats from "../Chats";
import SearchTarget from "../SearchTarget";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { DefaultLoader } from "../../../../shared/UI/Loader";
import SettingsList from "../SettingsList";
import { FriendsExplorer } from "../../../../features/Friends";

interface NavigatorExplorerProps extends UiComponentProps<HTMLDivElement> {
    target: ExplorerTarget;
}

export default function NavigatorExplorer(props: NavigatorExplorerProps) {
    const { className = "", target, ...otherProps } = props;

    const auth = useTypedSelector((state) => state.auth);

    if (!auth.payload && (auth.request.status === "pending" || auth.request.status === "idle")) {
        return <DefaultLoader style={{ textAlign: "center", marginTop: "50px", marginInline: "auto" }} />;
    }

    const classes = ["TNUI-NavigatorExplorer", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {target === "chats" && <Chats />}
            {target === "search" && <SearchOptions />}
            {target === "friends" && <FriendsExplorer />}
            {target === "settings" && <SettingsList />}
            {target === "communities" && (
                <span
                    style={{
                        width: "100%",
                        marginTop: "15px",
                        display: "flex",
                        color: "crimson",
                        fontSize: "22px",
                        textAlign: "center",
                    }}
                >
                    Данная функция находиться в процессе разработке
                </span>
            )}
        </div>
    );
}

// ================================================================

function SearchOptions() {
    return (
        <>
            <SearchTarget target="users" />
            <SearchTarget target="communities" />
            <SearchTarget target="chats" />
        </>
    );
}
