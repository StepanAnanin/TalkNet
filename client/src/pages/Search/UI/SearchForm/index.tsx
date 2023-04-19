import "./SearchForm.scss";
import React from "react";

import CloseIcon from "@mui/icons-material/StartOutlined";
import OpenIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/QuestionAnswerRounded";
import UserIcon from "@mui/icons-material/Group";
import CommunityIcon from "@mui/icons-material/GridViewOutlined";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import TextInput from "../../../../shared/UI/TextInput";
import Button from "../../../../shared/UI/Button";

interface ChatSearchProps extends UiComponentProps<HTMLDivElement> {
    isOpen?: boolean;
}

type SearchTarget = "chat" | "user" | "community";

const searchTargetTypeMap: readonly SearchTarget[] = ["chat", "user", "community"] as const;

const searchInItemIdOrigin = "search-page_search-target-";

export default function ChatSearch(props: ChatSearchProps) {
    const { className = "", isOpen = false, ...otherProps } = props;

    const [searchTarget, setSearchTarget] = React.useState<SearchTarget>("community");

    const windowLayout = useTypedSelector((state) => state.windowLayout);

    function onSearchInItemClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const target = e.currentTarget.id.split(searchInItemIdOrigin)[1];

        if (!searchTargetTypeMap.includes) {
            throw new TypeError(`Search target has incorrect value: ${target}`);
        }

        if (target === searchTarget) {
            return;
        }

        setSearchTarget(target as SearchTarget);
    }

    function handleSearch() {
        console.log(searchTarget);
    }

    const classes = ["TNUI-ChatSearch", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <div className="TNUI-ChatSearch-content">
                <div className="TNUI-ChatSearch-header">
                    {/* TODO replace one of this icon with more suitable for other */}
                    {windowLayout.breakpoint <= 998 &&
                        (isOpen ? (
                            <CloseIcon className="TNUI-ChatSearch-header_icon" />
                        ) : (
                            <OpenIcon className="TNUI-ChatSearch-header_icon" />
                        ))}
                    <span className="TNUI-ChatSearch-header_label">Поиск</span>
                </div>
                <div className="TNUI-ChatSearch-body">
                    <div className="TNUI-ChatSearch-body-input-block">
                        <TextInput className="TNUI-ChatSearch-body_search-input" type="search" />
                        <Button variant="contained" className="TNUI-ChatSearch-body_search-button" onClick={handleSearch}>
                            Найти
                        </Button>
                    </div>
                    <div className="TNUI-ChatSearch-body_search-result-list">
                        <div className="TNUI-ChatSearch-body_search-result-list-item"></div>
                    </div>
                </div>
            </div>
            <div className="TNUI-ChatSearch-sidebar">
                <div className="TNUI-ChatSearch-sidebar_header">Параметры поиска</div>
                <div className="TNUI-ChatSearch-sidebar_content">
                    <div className="TNUI-ChatSearch-sidebar-search-in-block">
                        <div
                            className={
                                "TNUI-ChatSearch-sidebar-search-in-block_item" +
                                (searchTarget === "community" ? " current" : "")
                            }
                            id={searchInItemIdOrigin + "community"}
                            onClick={onSearchInItemClick}
                        >
                            <CommunityIcon className="TNUI-ChatSearch-sidebar-search-in-block_item-icon" />
                            <span className="TNUI-ChatSearch-sidebar-search-in-block_item-label">Сообщества</span>
                        </div>

                        <div
                            className={
                                "TNUI-ChatSearch-sidebar-search-in-block_item" + (searchTarget === "user" ? " current" : "")
                            }
                            id={searchInItemIdOrigin + "user"}
                            onClick={onSearchInItemClick}
                        >
                            <UserIcon className="TNUI-ChatSearch-sidebar-search-in-block_item-icon" />
                            <span className="TNUI-ChatSearch-sidebar-search-in-block_item-label">Пользователи</span>
                        </div>

                        <div
                            className={
                                "TNUI-ChatSearch-sidebar-search-in-block_item" + (searchTarget === "chat" ? " current" : "")
                            }
                            id={searchInItemIdOrigin + "chat"}
                            onClick={onSearchInItemClick}
                        >
                            <ChatIcon className="TNUI-ChatSearch-sidebar-search-in-block_item-icon" />
                            <span className="TNUI-ChatSearch-sidebar-search-in-block_item-label">Чаты</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
