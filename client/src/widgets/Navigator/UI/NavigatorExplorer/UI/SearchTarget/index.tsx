import "./SearchTarget.scss";
import React from "react";

import CommunitiesIcon from "@mui/icons-material/GridViewOutlined";
import FriendsIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/QuestionAnswerRounded";

import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";

import NavigatorExplorerItem from "../../../../../../features/NavigatorExplorerItem";
import { useLocation } from "react-router-dom";

type SearchTargetOption = "chats" | "users" | "communities";

const searchTargetsMap: readonly SearchTargetOption[] = ["chats", "users", "communities"] as const;

interface SearchTargetProps extends UiComponentProps<HTMLAnchorElement> {
    target: SearchTargetOption;
}

export default function SearchTarget(props: SearchTargetProps) {
    const { className = "", target, ...otherProps } = props;

    const location = useLocation();
    const currentTarget = (() => {
        const currentPath = location.pathname;

        if (currentPath !== "/n/search") {
            return null;
        }

        return new URLSearchParams(location.search).get("target");
    })();

    if (!searchTargetsMap.includes(target)) {
        throw new TypeError(`Received incorrect search target`);
    }

    const classes = ["TNUI-SearchTarget", currentTarget === target ? "TNUI-SearchTarget__active" : "", className ?? ""].join(
        " "
    );

    return (
        <NavigatorExplorerItem
            to={"/n/search?target=" + target}
            img={getSearchTargetIcon(target)}
            className={classes}
            {...otherProps}
        >
            <span className="TNUI-SearchTarget-label">
                {target === "users" && "Пользователи"}
                {target === "communities" && "Сообщества"}
                {target === "chats" && "Чаты"}
            </span>
        </NavigatorExplorerItem>
    );
}

function getSearchTargetIcon(target: SearchTargetOption) {
    switch (target) {
        case "users":
            return <FriendsIcon className="TNUI-SearchTarget-icon" />;
        case "communities":
            return <CommunitiesIcon className="TNUI-SearchTarget-icon" />;
        case "chats":
            return <ChatIcon className="TNUI-SearchTarget-icon" />;
        default:
            throw new TypeError(`Received incorrect search target`);
    }
}
