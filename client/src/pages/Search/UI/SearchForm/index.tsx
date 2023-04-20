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
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import Avatar from "../../../../shared/UI/Avatar";
import { Navigate } from "react-router-dom";

interface ChatSearchProps extends UiComponentProps<HTMLDivElement> {
    isOpen?: boolean;
}

type SearchTarget = "chat" | "user" | "community";

const searchTargetTypeMap: readonly SearchTarget[] = ["chat", "user", "community"] as const;

const searchInItemIdOrigin = "search-page_search-target-";

// TODO require decomposition
export default function ChatSearch(props: ChatSearchProps) {
    const { className = "", isOpen = false, ...otherProps } = props;

    const windowLayout = useTypedSelector((state) => state.windowLayout);
    const { user } = useTypedSelector((state) => state.auth);

    const [searchTarget, setSearchTarget] = React.useState<SearchTarget>("community");
    const [searchResult, setSearchResult] = React.useState<any[]>([]);

    const firstSearchElementRef = React.useRef<HTMLInputElement>(null);
    const secondSearchElementRef = React.useRef<HTMLInputElement>(null);
    const thirdSearchElementRef = React.useRef<HTMLInputElement>(null);
    const searchPageRef = React.useRef(1);

    if (!user) {
        return <Navigate to="/signin" />;
    }

    function onSearchInItemClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const target = e.currentTarget.id.split(searchInItemIdOrigin)[1];

        if (!searchTargetTypeMap.includes) {
            throw new TypeError(`Search target has incorrect value: ${target}`);
        }

        if (target === searchTarget) {
            return;
        }

        setSearchResult([]);
        setSearchTarget(target as SearchTarget);
    }

    function handleSearchButtonClick() {
        // console.log(searchTarget);
        if (searchTarget === "user") {
            handleSearchFriends();
            return;
        }
    }

    async function handleSearchFriends() {
        const nameInputElement = firstSearchElementRef.current!;
        const surnameInputElement = secondSearchElementRef.current!;
        const patronymicInputElement = thirdSearchElementRef.current!;

        if (
            !(nameInputElement instanceof HTMLInputElement) &&
            !(surnameInputElement instanceof HTMLInputElement) &&
            !(patronymicInputElement instanceof HTMLInputElement)
        ) {
            throw new Error("Failed to find required inputs");
        }

        const searchedName = nameInputElement.value;
        const searchedSurname = surnameInputElement.value;
        const searchedPatronymic = patronymicInputElement.value;

        if (!searchedName && !searchedSurname && !searchedPatronymic) {
            console.error("No search");
            return;
        }

        // remove this, just start string from page and than add all other shit to it
        const queryParams = new URLSearchParams();

        if (searchedName) {
            queryParams.set("name", searchedName);
        }
        if (searchedSurname) {
            queryParams.set("surname", searchedSurname);
        }
        if (searchedPatronymic) {
            queryParams.set("patronymic", searchedPatronymic);
        }

        // TODO temp, add possibility to select page
        const stringifiedQueryParams = "?" + queryParams.toString() + "&page=" + searchPageRef.current;

        try {
            const response = await TalkNetAPI.get("/search/user" + stringifiedQueryParams);

            setSearchResult(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function sendFriendRequest(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const targetID = e.currentTarget.id;

        try {
            await TalkNetAPI.patch("/user/friend", {
                initiatorID: user!.id,
                targetID,
            });

            console.log("success");
        } catch (err) {
            console.log(err);
        }
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
                        <TextInput
                            className="TNUI-ChatSearch-body_search-input"
                            ref={firstSearchElementRef}
                            type="search"
                            staticPlaceholder="Имя"
                        />
                        {searchTarget === "user" && (
                            <TextInput
                                className="TNUI-ChatSearch-body_search-input"
                                ref={secondSearchElementRef}
                                type="search"
                                staticPlaceholder="Фамилия"
                            />
                        )}
                        {searchTarget === "user" && (
                            <TextInput
                                className="TNUI-ChatSearch-body_search-input"
                                ref={thirdSearchElementRef}
                                type="search"
                                staticPlaceholder="Отчество"
                            />
                        )}
                        <Button
                            variant="contained"
                            className="TNUI-ChatSearch-body_search-button"
                            onClick={handleSearchButtonClick}
                        >
                            Найти
                        </Button>
                    </div>
                    <div className="TNUI-ChatSearch-body_search-result-list">
                        {searchResult.length === 0 && (
                            <div className="TNUI-ChatSearch-body_nothing-found-alert">Ничего не найдено</div>
                        )}
                        {/* TODO require refactoring */}
                        {searchResult.map((item) => (
                            <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                <Avatar size="medium" className="TNUI-ChatSearch-body_search-result-list-item-avatar" />
                                <span className="TNUI-ChatSearch-body_search-result-list-item-full-user-name">
                                    {item.name} {item.surname} {item.patronymic}
                                </span>
                                <Button
                                    variant="contained"
                                    className="TNUI-ChatSearch-body_search-result-list-item-add-button"
                                    // TODO temp???
                                    id={item.id}
                                    onClick={sendFriendRequest}
                                >
                                    Добавить
                                </Button>
                            </div>
                        ))}
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
