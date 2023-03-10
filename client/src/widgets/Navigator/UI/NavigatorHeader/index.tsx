import "./NavigatorHeader.scss";
import React from "react";

import OpenedIcon from "@mui/icons-material/StartOutlined";
import ClosedIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GroupChatIcon from "@mui/icons-material/Groups";
import CommunitiesIcon from "@mui/icons-material/GridViewOutlined";
import FriendsIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/ChatRounded";
import SettingsIcon from "@mui/icons-material/SettingsRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import { Link } from "react-router-dom";

interface NavigatorHeaderProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function NavigatorHeader(props: NavigatorHeaderProps) {
    const { className = "", ...otherProps } = props;

    const pageListRef = React.useRef<HTMLDivElement | null>(null);

    const currentPage = window.location.pathname.split("/")[1];
    const classes = ["TNUI-NavigatorHeader", className].join(" ");

    function pageListWheelHandler(e: React.WheelEvent<HTMLDivElement>) {
        const pageList = pageListRef.current;

        if (!(pageList instanceof HTMLDivElement)) {
            throw new Error(`NavigatorHeader: pageListRef is refrence to null.`);
        }

        console.log(e.deltaY);

        pageList.scrollLeft += e.deltaY;
    }

    return (
        <div className={classes} {...otherProps}>
            <div className="TNUI-NavigatorHeader-top">
                <div className="TNUI-NavigatorHeader-page-list" onWheel={pageListWheelHandler} ref={pageListRef}>
                    <Link to="#" className={"TNUI-NavigatorHeader-page-list_item " + (currentPage === "m" ? "current" : "")}>
                        <div className="TNUI-NavigatorHeader-page-list_item-img-wrapper">
                            <ChatIcon
                                className="TNUI-NavigatorHeader-page-list_item-img"
                                id="TNUI-NavigatorHeader-page-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-page-list_item-label">Сообщения</span>
                    </Link>
                    <Link
                        to="#"
                        className={"TNUI-NavigatorHeader-page-list_item " + (currentPage === "communities" ? "current" : "")}
                    >
                        <div className="TNUI-NavigatorHeader-page-list_item-img-wrapper">
                            <CommunitiesIcon
                                className="TNUI-NavigatorHeader-page-list_item-img"
                                id="TNUI-NavigatorHeader-page-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-page-list_item-label">Сообщества</span>
                    </Link>
                    <Link
                        to="#"
                        className={"TNUI-NavigatorHeader-page-list_item " + (currentPage === "friends" ? "current" : "")}
                    >
                        <div className="TNUI-NavigatorHeader-page-list_item-img-wrapper">
                            <FriendsIcon
                                className="TNUI-NavigatorHeader-page-list_item-img"
                                id="TNUI-NavigatorHeader-page-list_item-messages-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-page-list_item-label">Друзья</span>
                    </Link>
                    <Link
                        to="/settings"
                        className={"TNUI-NavigatorHeader-page-list_item " + (currentPage === "friends" ? "current" : "")}
                    >
                        <div className="TNUI-NavigatorHeader-page-list_item-img-wrapper">
                            <SettingsIcon
                                className="TNUI-NavigatorHeader-page-list_item-img"
                                id="TNUI-NavigatorHeader-page-list_item-settings-img"
                            />
                        </div>
                        <span className="TNUI-NavigatorHeader-page-list_item-label">Настройки</span>
                    </Link>
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
