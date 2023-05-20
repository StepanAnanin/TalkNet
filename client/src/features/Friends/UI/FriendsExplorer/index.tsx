import "./FriendsExplorer.scss";
import React from "react";

import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import FriendList from "../FriendList";
import FriendRequests from "../FriendRequests";
import FriendsExplorerRefreshButton from "../FriendsExplorerRefreshButton";

type FriendsExplorerTarget = "friend-list" | "incoming-friend-requests" | "outcoming-friend-requests";

const friendsExplorerTargetIdRoot = "TNUI-Friends-explorer_target-";

const friendsExplorerTargetsMap: readonly FriendsExplorerTarget[] = [
    "friend-list",
    "incoming-friend-requests",
    "outcoming-friend-requests",
] as const;

export default function FriendsExplorer() {
    const { payload: user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error("Require authorization.");
    }

    const [friendsExplorerTarget, setFriendsExplorerTarget] = React.useState<FriendsExplorerTarget>("friend-list");

    function friendsExplorerTargetsItemClickHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        const targetElementId = e.currentTarget.id;
        const newFriendExplorerTarget = targetElementId.split(friendsExplorerTargetIdRoot)[1] as FriendsExplorerTarget;

        if (!friendsExplorerTargetsMap.includes(newFriendExplorerTarget)) {
            throw new TypeError("Received incorrect friendExplorerTarget");
        }

        if (newFriendExplorerTarget === friendsExplorerTarget) {
            return;
        }

        setFriendsExplorerTarget(newFriendExplorerTarget);
    }

    return (
        <div className="TNUI-Friends-explorer">
            <div className="TNUI-Friends-explorer-targets">
                <span
                    className={
                        "TNUI-Friends-explorer-targets_item " +
                        (friendsExplorerTarget === "friend-list" ? "TNUI-Friends-explorer-targets_item__current" : "")
                    }
                    id={friendsExplorerTargetIdRoot + "friend-list"}
                    onClick={friendsExplorerTargetsItemClickHandler}
                >
                    Список друзей
                </span>
                <span
                    className={
                        "TNUI-Friends-explorer-targets_item " +
                        (friendsExplorerTarget === "incoming-friend-requests"
                            ? "TNUI-Friends-explorer-targets_item__current"
                            : "")
                    }
                    id={friendsExplorerTargetIdRoot + "incoming-friend-requests"}
                    onClick={friendsExplorerTargetsItemClickHandler}
                >
                    Входящие заявки
                </span>
                <span
                    className={
                        "TNUI-Friends-explorer-targets_item " +
                        (friendsExplorerTarget === "outcoming-friend-requests"
                            ? "TNUI-Friends-explorer-targets_item__current"
                            : "")
                    }
                    id={friendsExplorerTargetIdRoot + "outcoming-friend-requests"}
                    onClick={friendsExplorerTargetsItemClickHandler}
                >
                    Исходящие заявки
                </span>
            </div>
            <FriendsExplorerRefreshButton explorerTarget={friendsExplorerTarget} />
            {friendsExplorerTarget === "friend-list" ? (
                <FriendList />
            ) : (
                <FriendRequests requestsType={friendsExplorerTarget} />
            )}
        </div>
    );
}
