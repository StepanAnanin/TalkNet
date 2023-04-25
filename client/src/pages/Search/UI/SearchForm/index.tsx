import "./SearchForm.scss";
import React from "react";

import CloseIcon from "@mui/icons-material/StartOutlined";
import OpenIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/QuestionAnswerRounded";
import UserIcon from "@mui/icons-material/Group";
import CommunityIcon from "@mui/icons-material/GridViewOutlined";
import TuneIcon from "@mui/icons-material/TuneRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import TextInput from "../../../../shared/UI/TextInput";
import Button from "../../../../shared/UI/Button";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import Avatar from "../../../../shared/UI/Avatar";
import { Navigate } from "react-router-dom";
import Accordion from "../../../../shared/UI/Accordion";

interface ChatSearchProps extends UiComponentProps<HTMLDivElement> {
    isOpen?: boolean;
}

type SearchTarget = "chat" | "user" | "community";

const searchTargetTypeMap: readonly SearchTarget[] = ["chat", "user", "community"] as const;

const searchInItemIdOrigin = "search-page_search-target-";

interface SearchResult {
    page: number;
    payload: Friend[];
}

interface Friend {
    id: string;
    name: string;
    surname: string | null;
    patronymic: string | null;
}

// TODO require decomposition
// TODO add loader for search result
export default function ChatSearch(props: ChatSearchProps) {
    const { className = "", isOpen = false, ...otherProps } = props;

    const windowLayout = useTypedSelector((state) => state.windowLayout);
    const { user } = useTypedSelector((state) => state.auth);

    const [searchTarget, setSearchTarget] = React.useState<SearchTarget>("user");
    const [searchResult, setSearchResult] = React.useState<SearchResult>({ page: 1, payload: [] });
    const [searchResultPage, setSearchResultPage] = React.useState(1);

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

        setSearchResult({ page: 1, payload: [] });
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

            // TODO change page dynamicaly
            setSearchResult({ page: 1, payload: response.data });
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

    console.log(searchResult);

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
                    <Accordion
                        header={
                            <>
                                <TuneIcon className="TNUI-ChatSearch-search-params_header-icon" />
                                <span className="TNUI-ChatSearch-search-params_header-label">Параметры поиска</span>
                            </>
                        }
                        className="TNUI-ChatSearch-search-params-root"
                        headerClassName="TNUI-ChatSearch-search-params_header"
                        bodyClassName="TNUI-ChatSearch-search-params"
                        defaultOpen
                    >
                        <div className="TNUI-ChatSearch-search-params-target-list">
                            <div className="TNUI-ChatSearch-search-params-target-list_header">Искать:</div>
                            <div className="TNUI-ChatSearch-search-params-target-list_body">
                                <div
                                    className={
                                        "TNUI-ChatSearch-search-params-target-list_item" +
                                        (searchTarget === "community" ? " current" : "")
                                    }
                                    id={searchInItemIdOrigin + "community"}
                                    onClick={onSearchInItemClick}
                                >
                                    <CommunityIcon className="TNUI-ChatSearch-search-params-target-list_item-icon" />
                                    <span className="TNUI-ChatSearch-search-params-target-list_item-label">Сообщества</span>
                                </div>
                                <div
                                    className={
                                        "TNUI-ChatSearch-search-params-target-list_item" +
                                        (searchTarget === "user" ? " current" : "")
                                    }
                                    id={searchInItemIdOrigin + "user"}
                                    onClick={onSearchInItemClick}
                                >
                                    <UserIcon className="TNUI-ChatSearch-search-params-target-list_item-icon" />
                                    <span className="TNUI-ChatSearch-search-params-target-list_item-label">
                                        Пользователей
                                    </span>
                                </div>
                                <div
                                    className={
                                        "TNUI-ChatSearch-search-params-target-list_item" +
                                        (searchTarget === "chat" ? " current" : "")
                                    }
                                    id={searchInItemIdOrigin + "chat"}
                                    onClick={onSearchInItemClick}
                                >
                                    <ChatIcon className="TNUI-ChatSearch-search-params-target-list_item-icon" />
                                    <span className="TNUI-ChatSearch-search-params-target-list_item-label">Чаты</span>
                                </div>
                            </div>
                        </div>
                        <div className="TNUI-ChatSearch-search-params-input-block">
                            <div className="TNUI-ChatSearch-search-params-input-block_header">Запрос:</div>
                            <TextInput
                                className="TNUI-ChatSearch-search-params_search-input"
                                ref={firstSearchElementRef}
                                type="search"
                                staticPlaceholder="Имя"
                            />
                            {searchTarget === "user" && (
                                <TextInput
                                    className="TNUI-ChatSearch-search-params_search-input"
                                    ref={secondSearchElementRef}
                                    type="search"
                                    staticPlaceholder="Фамилия"
                                />
                            )}
                            {searchTarget === "user" && (
                                <TextInput
                                    className="TNUI-ChatSearch-search-params_search-input"
                                    ref={thirdSearchElementRef}
                                    type="search"
                                    staticPlaceholder="Отчество"
                                />
                            )}
                        </div>
                        <Button
                            variant="contained"
                            className="TNUI-ChatSearch-search-params-search-button"
                            onClick={handleSearchButtonClick}
                        >
                            Поиск
                        </Button>
                    </Accordion>

                    <div className="TNUI-ChatSearch-body_search-result-list">
                        <div className="TNUI-ChatSearch-body_search-result-list_header">
                            Результат поиска по вашему запросу:
                        </div>
                        {searchResult.payload.length === 0 && searchResult.page === 1 && (
                            <div className="TNUI-ChatSearch-body_nothing-found-alert">Ничего не найдено</div>
                        )}
                        {/* TODO require refactoring */}
                        {searchResult.payload.map((item) => (
                            <>
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
                                <>
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                    <div key={item.id} className="TNUI-ChatSearch-body_search-result-list-item">
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChatSearch-body_search-result-list-item-avatar"
                                        />
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
                                </>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
