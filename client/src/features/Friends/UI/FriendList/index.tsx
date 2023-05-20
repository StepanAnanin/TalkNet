import "../styles/FriendsExplorerCommon.scss";
import React from "react";

import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import addFetchFriends from "../../model/store/actionCreators/friendsActions";
import { DefaultLoader } from "../../../../shared/UI/Loader";

import SadSmileIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Preview from "../../../../shared/UI/Preview";
import Avatar from "../../../../shared/UI/Avatar";

export default function FriendList() {
    const { payload: friends, request: fetchRequest } = useTypedSelector((state) => state.friends);
    const dispatch = useTypedDispatch();

    const isLoading = fetchRequest.status !== "succeeded";

    React.useEffect(() => {
        (async function () {
            if (!isLoading || Array.isArray(friends)) {
                return;
            }

            await dispatch(addFetchFriends());
        })();
    }, [friends]);

    return (
        <>
            {isLoading && <DefaultLoader className="TNUI-Friends-explorer-loader" />}
            {!isLoading && friends?.length === 0 && (
                <div className="TNUI-Friends-explorer-empty-content-alert">
                    <SadSmileIcon className="TNUI-Friends-explorer-empty-content-alert_icon" />
                    <span className="TNUI-Friends-explorer-empty-content-alert_label">Увы, у вас нет друзей</span>
                </div>
            )}
            {!isLoading &&
                friends?.map((user) => {
                    return (
                        // TODO redesign this element
                        <Preview
                            key={user.id}
                            img={<Avatar userID={user.id} className="TNUI-Friends-explorer-content-item_user-avatar" />}
                        >
                            <div className="TNUI-Friends-explorer-content-item">
                                <span
                                    className="TNUI-Friends-explorer-content-item_user-name"
                                    title={`${user.surname} ${user.name}`}
                                >
                                    {user.name} {user.surname}
                                </span>
                            </div>
                        </Preview>
                    );
                })}
        </>
    );
}
