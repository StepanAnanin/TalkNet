import "./SearchForm.scss";
import React from "react";

import CloseIcon from "@mui/icons-material/StartOutlined";
import OpenIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/TuneRounded";
import NoSearchResultIcon from "@mui/icons-material/SearchOffRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import { Navigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { laptopLayout } from "../../../../shared/lib/helpers/WindowLayoutBreakPoints";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import TextInput from "../../../../shared/UI/TextInput";
import Button from "../../../../shared/UI/Button";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import Avatar from "../../../../shared/UI/Avatar";
import Accordion from "../../../../shared/UI/Accordion";

interface SearchFormProps extends UiComponentProps<HTMLDivElement> {
    isOpen?: boolean;
}

type SearchTarget = "chats" | "users" | "communities";

const searchTargetsMap: readonly SearchTarget[] = ["chats", "users", "communities"] as const;

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

function getSearchInpuPlaceholder(searchTarget: SearchTarget) {
    switch (searchTarget) {
        case "users":
            return "Имя";
        case "chats":
            return "Название чата";
        case "communities":
            return "Название сообщества";
        default:
            throw new TypeError("Invalid search target");
    }
}

// TODO require decomposition
// TODO add loader for search result
// TODO fix add button responsivness when it's disabled
export default function SearchForm(props: SearchFormProps) {
    const { className = "", isOpen = false, ...otherProps } = props;

    const [queryParams] = useSearchParams();
    const { user } = useTypedSelector((state) => state.auth);
    const windowLayout = useTypedSelector((state) => state.windowLayout);

    const searchTarget = queryParams.get("target") as SearchTarget;
    const prevSearchTargetRef = React.useRef<SearchTarget>(searchTarget);

    const [searchResult, setSearchResult] = React.useState<SearchResult>({ page: 1, payload: [] });
    const [isLoading, setIsLoading] = React.useState(false);

    const firstSearchElementRef = React.useRef<HTMLInputElement>(null);
    const secondSearchElementRef = React.useRef<HTMLInputElement>(null);
    const thirdSearchElementRef = React.useRef<HTMLInputElement>(null);
    const searchPageRef = React.useRef(1);

    // This useEffect reset search result and first input value on search target chage.
    // (first input exist for any value of search target, but not second and third inputs)
    React.useEffect(() => {
        if (prevSearchTargetRef.current === searchTarget) {
            return;
        }

        const firstSearchElement = firstSearchElementRef.current;

        if (!(firstSearchElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find first input element");
        }

        // This condition prevents at least 1 excess render. Cuz this useEffect will always be called on first render.
        if (firstSearchElement.value === "" && searchResult.page === 1 && searchResult.payload.length === 0) {
            return;
        }

        setSearchResult({ page: 1, payload: [] });

        firstSearchElement.value = "";
    }, [searchTarget]);

    if (!user) {
        return <Navigate to="/signin" />;
    }

    // If there are no target or it's not valid, then set search target to 'users'
    if (!searchTargetsMap.includes(searchTarget)) {
        return <Navigate to="/n/search?target=users" />;
    }

    function handleSearch() {
        if (searchTarget === "users") {
            searchFriends();
            return;
        }
    }

    async function searchFriends() {
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
        const addButtonElement = e.currentTarget;
        const targetID = addButtonElement.id;

        try {
            if (searchTarget === "users") {
                await TalkNetAPI.post("/user/friend-requests", {
                    from: user!.id,
                    to: targetID,
                });

                addButtonElement.disabled = true;
                addButtonElement.innerText = "Заявка отправленна";

                console.log("success");

                return;
            }

            throw new Error("NOT IMPLEMENTED");
        } catch (err) {
            if (err instanceof AxiosError && err.response!.status === 409) {
                // TODO temp, replace this
                alert(err.response!.data.message ?? "xdd");
            }

            console.log(err);
        }
    }

    function submitSearchInputHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.code === "Enter") {
            handleSearch();
        }
    }

    const classes = ["TNUI-ChatSearch", className].join(" ");

    //=================================================================================================================
    // debuging

    console.log(user);

    return (
        <div className={classes} {...otherProps}>
            <div className="TNUI-ChatSearch-content">
                <div className="TNUI-ChatSearch-header">
                    {windowLayout.breakpoint <= laptopLayout.breakpoint &&
                        // TODO replace one of this icon with more suitable for other
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
                        <div className="TNUI-ChatSearch-search-params-input-block">
                            <div className="TNUI-ChatSearch-search-params-input-block_header">Запрос:</div>
                            <TextInput
                                className="TNUI-ChatSearch-search-params_search-input"
                                ref={firstSearchElementRef}
                                type="search"
                                staticPlaceholder={getSearchInpuPlaceholder(searchTarget)}
                                onKeyUp={submitSearchInputHandler}
                            />
                            {searchTarget === "users" && (
                                <TextInput
                                    className="TNUI-ChatSearch-search-params_search-input"
                                    ref={secondSearchElementRef}
                                    type="search"
                                    staticPlaceholder="Фамилия"
                                    onKeyUp={submitSearchInputHandler}
                                />
                            )}
                            {searchTarget === "users" && (
                                <TextInput
                                    className="TNUI-ChatSearch-search-params_search-input"
                                    ref={thirdSearchElementRef}
                                    type="search"
                                    staticPlaceholder="Отчество"
                                    onKeyUp={submitSearchInputHandler}
                                />
                            )}
                        </div>
                        <Button
                            variant="contained"
                            className="TNUI-ChatSearch-search-params-search-button"
                            onClick={handleSearch}
                        >
                            Поиск
                        </Button>
                    </Accordion>
                    <div className="TNUI-ChatSearch-body_search-result-list">
                        {searchTarget === "users" && (
                            <div className="TNUI-ChatSearch-body_search-result-list_header">
                                Результат поиска по вашему запросу:
                            </div>
                        )}
                        {searchTarget !== "users" && (
                            <div style={{ width: "100%", textAlign: "center", fontSize: "26px", color: "crimson" }}>
                                Данная функция находится в процессе разработки
                            </div>
                        )}
                        {searchTarget === "users" && searchResult.payload.length === 0 && searchResult.page === 1 && (
                            <div className="TNUI-ChatSearch-body_nothing-found-alert">
                                <NoSearchResultIcon className="TNUI-ChatSearch-body_nothing-found-alert_icon" />
                                <span className="TNUI-ChatSearch-body_nothing-found-alert_label">Ничего не надено</span>
                            </div>
                        )}
                        {/* TODO require refactoring */}
                        {searchResult.payload.map((item, index) => (
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
                                {/* TODO Shit below is temp, only for testing */}
                                <>
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
                                    <div key={index} className="TNUI-ChatSearch-body_search-result-list-item">
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
