import "./Friends.scss";
import React from "react";

import SadSmileIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import RefershIcon from "@mui/icons-material/AutorenewRounded";

import { useTypedSelector } from "../../../../../../shared/model/hooks/useTypedSelector";
import { DefaultLoader } from "../../../../../../shared/UI/Loader";
import { Link } from "react-router-dom";
import Avatar from "../../../../../../shared/UI/Avatar";
import Button from "../../../../../../shared/UI/Button";
import { useTypedDispatch } from "../../../../../../shared/model/hooks/useTypedDispatch";
import addFetchFriends from "../../../../model/store/actionCreators/friendsActions";
import addFetchIncomingFriendRequests from "../../../../model/store/actionCreators/incomingFriendRequestsActions";
import addFetchOutcomingFriendRequests from "../../../../model/store/actionCreators/outcomingFriendRequests";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import { AxiosError } from "axios";

type FriendExplorerTarget = "friend-list" | "incoming-friend-requests" | "outcoming-friend-requests";

const friendExplorerTargetIdRoot = "TNUI-Friend-explorer_target-";

const friendExplorerTargetsMap: readonly FriendExplorerTarget[] = [
    "friend-list",
    "incoming-friend-requests",
    "outcoming-friend-requests",
] as const;

// TODO Show loader when user force content updating (by button click)
// TODO Handle request errors
export default function Friends() {
    const {
        auth: authState,
        friends: friendsState,
        incomingFriendRequests: incomingFriendRequestsState,
        outcomingFriendRequests: outcomingFriendRequestsState,
    } = useTypedSelector((state) => state);
    const dispatch = useTypedDispatch();

    const user = authState.payload;

    const [friendExplorerTarget, setFriendExplorerTarget] = React.useState<FriendExplorerTarget>("friend-list");

    const friendExplorerContent = (function () {
        if (friendExplorerTarget === "friend-list") {
            return friendsState;
        }

        if (friendExplorerTarget === "incoming-friend-requests") {
            return incomingFriendRequestsState;
        }

        if (friendExplorerTarget === "outcoming-friend-requests") {
            return outcomingFriendRequestsState;
        }

        throw new TypeError("Incorrect friendExplorerTarget value");
    })();

    const isLoading = friendExplorerContent.payload === null;

    if (!user) {
        throw new Error("Require authorization.");
    }

    React.useEffect(() => {
        // This is async function, so if you want to add some other actions after this function call,
        // need to wrap this in async IIFE and use before it "await".
        updateCurrentFriendExplorerContent();
    }, [friendExplorerTarget]);

    async function updateCurrentFriendExplorerContent(force = false) {
        if (!force && !isLoading) {
            return;
        }

        if (force) {
            document.body.style.cursor = "wait";
        }

        if (friendExplorerTarget === "friend-list") {
            await dispatch(addFetchFriends());
        }

        if (friendExplorerTarget === "incoming-friend-requests") {
            await dispatch(addFetchIncomingFriendRequests());
        }

        if (friendExplorerTarget === "outcoming-friend-requests") {
            await dispatch(addFetchOutcomingFriendRequests());
        }

        document.body.style.cursor = "default";
    }

    function friendExplorerTargetsItemClickHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        const targetElementId = e.currentTarget.id;
        const newFriendExplorerTarget = targetElementId.split(friendExplorerTargetIdRoot)[1] as FriendExplorerTarget;

        if (!friendExplorerTargetsMap.includes(newFriendExplorerTarget)) {
            throw new TypeError("Received incorrect friendExplorerTarget");
        }

        if (newFriendExplorerTarget === friendExplorerTarget) {
            return;
        }

        setFriendExplorerTarget(newFriendExplorerTarget);
    }

    async function friendRequestActionButtonClickHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        const targetedUserID = e.currentTarget.id;

        if (!targetedUserID) {
            throw new TypeError("Missing targeted user id");
        }

        if (friendExplorerTarget !== "incoming-friend-requests" && friendExplorerTarget !== "outcoming-friend-requests") {
            throw new TypeError("Invalid friendExplorerTarget value");
        }

        try {
            const endpoint = friendExplorerTarget === "incoming-friend-requests" ? "accept" : "decline";
            const response = await TalkNetAPI.patch("/user/friend-requests/" + endpoint, {
                from: friendExplorerTarget === "incoming-friend-requests" ? targetedUserID : user!.id,
                to: friendExplorerTarget === "incoming-friend-requests" ? user!.id : targetedUserID,
            });

            await updateCurrentFriendExplorerContent(true);

            // If user accept incoming request need to update his friend list state
            if (friendExplorerTarget === "incoming-friend-requests") {
                await dispatch(addFetchFriends());
            }
        } catch (err) {
            if (!(err instanceof AxiosError)) {
                throw err;
            }

            console.log(err);

            // TODO replace this with modal.
            alert("Во время запроса на сервер произошла ошибка. Страница будет перезагружена");

            window.location.reload();
        }
    }

    function friendExplorerRefreshContentButtonClickHandler() {
        if (isLoading) {
            return;
        }

        updateCurrentFriendExplorerContent(true);
    }

    return (
        <div className="TNUI-Friend-explorer">
            <div className="TNUI-Friend-explorer-targets">
                <span
                    className={
                        "TNUI-Friend-explorer-targets_item " +
                        (friendExplorerTarget === "friend-list" ? "TNUI-Friend-explorer-targets_item__current" : "")
                    }
                    id={friendExplorerTargetIdRoot + "friend-list"}
                    onClick={friendExplorerTargetsItemClickHandler}
                >
                    Список друзей
                </span>
                <span
                    className={
                        "TNUI-Friend-explorer-targets_item " +
                        (friendExplorerTarget === "incoming-friend-requests"
                            ? "TNUI-Friend-explorer-targets_item__current"
                            : "")
                    }
                    id={friendExplorerTargetIdRoot + "incoming-friend-requests"}
                    onClick={friendExplorerTargetsItemClickHandler}
                >
                    Входящие заявки
                </span>
                <span
                    className={
                        "TNUI-Friend-explorer-targets_item " +
                        (friendExplorerTarget === "outcoming-friend-requests"
                            ? "TNUI-Friend-explorer-targets_item__current"
                            : "")
                    }
                    id={friendExplorerTargetIdRoot + "outcoming-friend-requests"}
                    onClick={friendExplorerTargetsItemClickHandler}
                >
                    Исходящие заявки
                </span>
            </div>
            <Button
                variant="outlined"
                size="small"
                className="TNUI-Friend-explorer-refresh-content-button"
                onClick={friendExplorerRefreshContentButtonClickHandler}
            >
                <span className="TNUI-Friend-explorer-refresh-content-button_label">Обновить</span>
                <RefershIcon className="TNUI-Friend-explorer-refresh-content-button_icon" />
            </Button>
            {isLoading && <DefaultLoader className="TNUI-Friend-explorer-loader" />}
            {!isLoading && friendExplorerContent.payload!.length === 0 && (
                <div className="TNUI-Friend-explorer-empty-content-alert">
                    {friendExplorerTarget === "friend-list" && (
                        <SadSmileIcon className="TNUI-Friend-explorer-empty-content-alert_icon" />
                    )}
                    <span className="TNUI-Friend-explorer-empty-content-alert_label">
                        {friendExplorerTarget === "friend-list" ? "Увы, у вас нет друзей" : "Заявки отсутствуют"}
                    </span>
                </div>
            )}
            {!isLoading &&
                friendExplorerContent!.payload!.map((user) => {
                    return (
                        <Link key={user.id} to="#" className="TNUI-Friend-explorer-content-item">
                            <Avatar className="TNUI-Friend-explorer-content-item_user-avatar" />
                            <span
                                className="TNUI-Friend-explorer-content-item_user-name"
                                title={`${user.surname} ${user.name}`}
                            >
                                {user.name} {user.surname}
                            </span>
                            {friendExplorerTarget !== "friend-list" && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    id={user.id}
                                    className="TNUI-Friend-explorer-content-item_action-button"
                                    onClick={friendRequestActionButtonClickHandler}
                                >
                                    {friendExplorerTarget === "incoming-friend-requests" && "Принять"}
                                    {friendExplorerTarget === "outcoming-friend-requests" && "Отклонить"}
                                </Button>
                            )}
                        </Link>
                    );
                })}
        </div>
    );
}
