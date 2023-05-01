import "./Friends.scss";
import React from "react";

import SadSmileIcon from "@mui/icons-material/SentimentDissatisfiedRounded";

import type BaseUserData from "../../../../../../shared/types/common/BaseUserData";

import { useTypedSelector } from "../../../../../../shared/model/hooks/useTypedSelector";
import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import { DefaultLoader } from "../../../../../../shared/UI/Loader";
import { Link } from "react-router-dom";
import Avatar from "../../../../../../shared/UI/Avatar";
import Button from "../../../../../../shared/UI/Button";

type FriendExplorerTarget = "friend-list" | "incoming-friend-requests" | "outcoming-friend-requests";

const friendExplorerTargetIdRoot = "TNUI-Friend-explorer_target-";

const friendExplorerTargetsMap: readonly FriendExplorerTarget[] = [
    "friend-list",
    "incoming-friend-requests",
    "outcoming-friend-requests",
] as const;

export async function getFriendRequests(requestsType: "incoming" | "outcoming") {
    const response = await TalkNetAPI.get("/user/friend-requests?type=" + requestsType);

    return response.data as BaseUserData[];
}

export async function getFriends() {
    const response = await TalkNetAPI.get("/user/friends");

    return response.data as BaseUserData[];
}

// TODO Require optimization. There are a lot of rerenders now
// BUG Sometimes occur error with request. It always return code 401 and token expired error.
//     Most likely it appears after second response with this code and error.
export default function Friends() {
    const { user } = useTypedSelector((state) => state.auth);

    const [friendExplorerTarget, setFriendExplorerTarget] = React.useState<FriendExplorerTarget>("friend-list");
    const [friendExplorerContent, setFriendExplorerContent] = React.useState<BaseUserData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const prevFriendExplorerTargetRef = React.useRef(friendExplorerTarget);

    if (!user) {
        throw new Error("Require authorization.");
    }

    React.useEffect(() => {
        (async function () {
            setFriendExplorerContent(await getFriends());
            setIsLoading(false);
        })();
    }, []);

    React.useEffect(() => {
        if (prevFriendExplorerTargetRef.current === friendExplorerTarget) {
            return;
        }

        setIsLoading(true);

        (async function () {
            try {
                if (friendExplorerTarget === "friend-list") {
                    setFriendExplorerContent(await getFriends());
                    prevFriendExplorerTargetRef.current = "friend-list";
                }

                if (friendExplorerTarget === "incoming-friend-requests") {
                    setFriendExplorerContent(await getFriendRequests("incoming"));
                    prevFriendExplorerTargetRef.current = "incoming-friend-requests";
                }

                if (friendExplorerTarget === "outcoming-friend-requests") {
                    setFriendExplorerContent(await getFriendRequests("outcoming"));
                    prevFriendExplorerTargetRef.current = "outcoming-friend-requests";
                }
            } catch (err) {
                if (!(err instanceof AxiosError)) {
                    throw err;
                }

                // TODO replase alert with modal window
                console.error(err);
                alert("Произошла непредвиденная ошибка. Страница будет перезагружена");
                window.location.reload();
            }

            setIsLoading(false);
        })();
    }, [friendExplorerTarget]);

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

    console.log("render");
    // console.log(friendExplorerContent);

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
            {isLoading && <DefaultLoader className="TNUI-Friend-explorer-loader" />}
            {!isLoading && friendExplorerTarget === "friend-list" && user.friends.length === 0 && (
                <div className="TNUI-Friend-explorer-empty-friend-list-alert">
                    <SadSmileIcon className="TNUI-Friend-explorer-empty-friend-list-alert_icon" />
                    <span className="TNUI-Friend-explorer-empty-friend-list-alert_label">Увы, у вас нет друзей</span>
                </div>
            )}
            {!isLoading &&
                friendExplorerContent.map((friend) => {
                    return (
                        <Link key={friend.id} to="#" className="TNUI-Friend-explorer-content-item">
                            <Avatar className="TNUI-Friend-explorer-content-item_user-avatar" />
                            <span
                                className="TNUI-Friend-explorer-content-item_user-name"
                                title={`${friend.surname} ${friend.name}`}
                            >
                                {friend.name} {friend.surname}
                            </span>
                            {friendExplorerTarget !== "friend-list" && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    className="TNUI-Friend-explorer-content-item_action-button"
                                >
                                    {friendExplorerTarget === "incoming-friend-requests" && "Принять"}
                                    {friendExplorerTarget === "outcoming-friend-requests" && "Отменить"}
                                </Button>
                            )}
                        </Link>
                    );
                })}
        </div>
    );
}
