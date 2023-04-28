import "./NavigatorHeader.scss";
import React from "react";

import OpenedIcon from "@mui/icons-material/StartOutlined";
import ClosedIcon from "@mui/icons-material/ArrowBack";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CommunitiesIcon from "@mui/icons-material/GridViewOutlined";
import FriendsIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/QuestionAnswerRounded";
import SettingsIcon from "@mui/icons-material/SettingsRounded";
import SearchIcon from "@mui/icons-material/SearchRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type ExplorerTarget from "../../types/ExplorerTarget";
import { useSearchParams } from "react-router-dom";

interface NavigatorHeaderProps extends UiComponentProps<HTMLDivElement> {
    // target: ExplorerTarget;
    targetState: [ExplorerTarget, React.Dispatch<React.SetStateAction<ExplorerTarget>>];
    hideAddButton?: boolean;
}

const explorerTargetMap: readonly ExplorerTarget[] = ["chats", "communities", "friends", "search", "settings"] as const;

const explorerTargetItemElementIdRoot = "NavigatorHeader-explorerTarget-";

export default function NavigatorHeader(props: NavigatorHeaderProps) {
    const { className = "", hideAddButton = false, targetState, ...otherProps } = props;

    const [navigatorTarget, setNavigatorTarget] = targetState;
    const [searchParams, setSearchParams] = useSearchParams();

    const pageListRef = React.useRef<HTMLDivElement | null>(null);

    const classes = ["TNUI-NavigatorHeader", className].join(" ");

    function pageListWheelHandler(e: React.WheelEvent<HTMLDivElement>) {
        const pageList = pageListRef.current;

        if (!(pageList instanceof HTMLDivElement)) {
            throw new Error(`NavigatorHeader: pageListRef is refrence to null.`);
        }

        pageList.scrollLeft += e.deltaY;
    }

    function explorerTargetItemClickHander(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const newExplorerTarget = e.currentTarget.id.split(explorerTargetItemElementIdRoot)[1] as ExplorerTarget;

        if (!explorerTargetMap.includes(newExplorerTarget)) {
            throw new TypeError(`Incorrect explorer target: ${newExplorerTarget}`);
        }

        // This condition is probably unnecessary, but won't be redundant.
        if (newExplorerTarget === navigatorTarget) {
            return;
        }

        setSearchParams((p) => {
            // nt — navigator target
            p.delete("nt");
            p.append("nt", newExplorerTarget);
            return p;
        });
        setNavigatorTarget(newExplorerTarget);
    }

    return (
        <div className={classes} {...otherProps}>
            <div className="TNUI-NavigatorHeader-top">
                <div className="TNUI-NavigatorHeader-explorer-target-list" onWheel={pageListWheelHandler} ref={pageListRef}>
                    <div
                        id={explorerTargetItemElementIdRoot + "chats"}
                        className={
                            "TNUI-NavigatorHeader-explorer-target-list_item " +
                            (navigatorTarget === "chats" ? "current" : "")
                        }
                        onClick={explorerTargetItemClickHander}
                    >
                        <div className="TNUI-NavigatorHeader-explorer-target-list_item-img-wrapper">
                            <ChatIcon
                                className="TNUI-NavigatorHeader-explorer-target-list_item-img"
                                id="TNUI-NavigatorHeader-explorer-target-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-explorer-target-list_item-label">Сообщения</span>
                    </div>
                    <div
                        id={explorerTargetItemElementIdRoot + "communities"}
                        className={
                            "TNUI-NavigatorHeader-explorer-target-list_item " +
                            (navigatorTarget === "communities" ? "current" : "")
                        }
                        onClick={explorerTargetItemClickHander}
                    >
                        <div className="TNUI-NavigatorHeader-explorer-target-list_item-img-wrapper">
                            <CommunitiesIcon
                                className="TNUI-NavigatorHeader-explorer-target-list_item-img"
                                id="TNUI-NavigatorHeader-explorer-target-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-explorer-target-list_item-label">Сообщества</span>
                    </div>
                    <div
                        id={explorerTargetItemElementIdRoot + "friends"}
                        className={
                            "TNUI-NavigatorHeader-explorer-target-list_item " +
                            (navigatorTarget === "friends" ? "current" : "")
                        }
                        onClick={explorerTargetItemClickHander}
                    >
                        <div className="TNUI-NavigatorHeader-explorer-target-list_item-img-wrapper">
                            <FriendsIcon
                                className="TNUI-NavigatorHeader-explorer-target-list_item-img"
                                id="TNUI-NavigatorHeader-explorer-target-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-explorer-target-list_item-label">Друзья</span>
                    </div>
                    <div
                        id={explorerTargetItemElementIdRoot + "search"}
                        className={
                            "TNUI-NavigatorHeader-explorer-target-list_item " +
                            (navigatorTarget === "search" ? "current" : "")
                        }
                        onClick={explorerTargetItemClickHander}
                    >
                        <div className="TNUI-NavigatorHeader-explorer-target-list_item-img-wrapper">
                            <SearchIcon
                                className="TNUI-NavigatorHeader-explorer-target-list_item-img"
                                id="TNUI-NavigatorHeader-explorer-target-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-explorer-target-list_item-label">Поиск</span>
                    </div>
                    <div
                        id={explorerTargetItemElementIdRoot + "settings"}
                        className={
                            "TNUI-NavigatorHeader-explorer-target-list_item " +
                            (navigatorTarget === "settings" ? "current" : "")
                        }
                        onClick={explorerTargetItemClickHander}
                    >
                        <div className="TNUI-NavigatorHeader-explorer-target-list_item-img-wrapper">
                            <SettingsIcon
                                className="TNUI-NavigatorHeader-explorer-target-list_item-img"
                                id="TNUI-NavigatorHeader-explorer-target-list_item-settings-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-explorer-target-list_item-label">Настройки</span>
                    </div>
                </div>
            </div>
            <div className="TNUI-NavigatorHeader-bottom">
                <div className="TNUI-NavigatorHeader-search">
                    <input className="TNUI-NavigatorHeader-search_input" placeholder="Поиск" />
                    <SearchOutlinedIcon className="TNUI-NavigatorHeader-search_icon" />
                </div>
            </div>
        </div>
    );
}
