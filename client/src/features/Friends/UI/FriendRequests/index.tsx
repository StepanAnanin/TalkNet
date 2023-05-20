import "../styles/FriendsExplorerCommon.scss";
import React from "react";

import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { DefaultLoader } from "../../../../shared/UI/Loader";
import Avatar from "../../../../shared/UI/Avatar";
import Preview from "../../../../shared/UI/Preview";
import addFetchIncomingFriendRequests from "../../model/store/actionCreators/incomingFriendRequestsActions";
import addFetchOutcomingFriendRequests from "../../model/store/actionCreators/outcomingFriendRequests";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import addFetchFriends from "../../model/store/actionCreators/friendsActions";
import { AxiosError } from "axios";
import Button from "../../../../shared/UI/Button";

interface FriendRequestsProps {
    requestsType: "incoming-friend-requests" | "outcoming-friend-requests";
}

// TODO add error handling for requests fetching.
export default function FriendRequests({ requestsType }: FriendRequestsProps) {
    if (requestsType !== "incoming-friend-requests" && requestsType !== "outcoming-friend-requests") {
        throw new TypeError("Received invalid friend requests type");
    }

    const {
        incomingFriendRequests,
        outcomingFriendRequests,
        auth: { payload: user },
    } = useTypedSelector((state) => state);
    const dispatch = useTypedDispatch();

    const { payload: requests, request: fetchState } =
        requestsType === "incoming-friend-requests" ? incomingFriendRequests : outcomingFriendRequests;

    const isLoading = fetchState.status === "pending";

    React.useEffect(() => {
        updateFriendRequests();
    }, [requestsType]);

    async function updateFriendRequests(force = false) {
        if (!force && (isLoading || fetchState.status === "succeeded")) {
            return;
        }

        if (requestsType === "outcoming-friend-requests") {
            await dispatch(addFetchOutcomingFriendRequests());
            return;
        }

        if (requestsType === "incoming-friend-requests") {
            await dispatch(addFetchIncomingFriendRequests());
            return;
        }

        throw new Error(`Unknow requests type: ${requestsType}`);
    }

    async function friendRequestActionButtonClickHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        const targetedUserID = e.currentTarget.id;

        if (!targetedUserID) {
            throw new TypeError("Missing targeted user id");
        }

        if (requestsType !== "incoming-friend-requests" && requestsType !== "outcoming-friend-requests") {
            throw new TypeError("Invalid requestsType value");
        }

        try {
            const endpoint = requestsType === "incoming-friend-requests" ? "accept" : "decline";

            await TalkNetAPI.patch("/user/friend-requests/" + endpoint, {
                from: requestsType === "incoming-friend-requests" ? targetedUserID : user!.id,
                to: requestsType === "incoming-friend-requests" ? user!.id : targetedUserID,
            });

            await updateFriendRequests(true);

            // If user accept incoming request need to update his friend list state
            if (requestsType === "incoming-friend-requests") {
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

    return (
        <>
            {isLoading && <DefaultLoader className="TNUI-Friends-explorer-loader" />}
            {!isLoading && requests?.length === 0 && (
                <div className="TNUI-Friends-explorer-empty-content-alert">
                    <span className="TNUI-Friends-explorer-empty-content-alert_label">Заявки отсутствуют</span>
                </div>
            )}
            {!isLoading &&
                requests?.map((user) => {
                    return (
                        <Preview
                            key={user.id}
                            className="TNUI-Friends-explorer-content-item"
                            img={<Avatar userID={user.id} className="TNUI-Friends-explorer-content-item_user-avatar" />}
                        >
                            <div className="TNUI-Friends-explorer-content-item">
                                <span
                                    className="TNUI-Friends-explorer-content-item_user-name"
                                    title={`${user.surname} ${user.name}`}
                                >
                                    {user.name} {user.surname}
                                </span>
                                <Button
                                    variant="contained"
                                    size="small"
                                    id={user.id}
                                    className="TNUI-Friends-explorer-content-item_action-button"
                                    onClick={friendRequestActionButtonClickHandler}
                                >
                                    {requestsType === "incoming-friend-requests" && "Принять"}
                                    {requestsType === "outcoming-friend-requests" && "Отклонить"}
                                </Button>
                            </div>
                        </Preview>
                    );
                })}
        </>
    );
}
