import "../styles/FriendsExplorerCommon.scss";
import React from "react";

import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { fetchFriends } from "../../model/store/actionCreators/friendsActions";
import { DefaultLoader } from "../../../../shared/UI/Loader";

import SadSmileIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Friend from "../../../../entities/Friend";

export default function FriendList() {
    const { payload: friends, request: fetchRequest } = useTypedSelector((state) => state.friends);
    const dispatch = useTypedDispatch();

    const isLoading = fetchRequest.status !== "succeeded";

    React.useEffect(() => {
        (async function () {
            if (!isLoading || Array.isArray(friends)) {
                return;
            }

            await dispatch(fetchFriends());
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
            {!isLoading && friends?.map((friend) => <Friend key={friend.id} friend={friend} />)}
        </>
    );
}
