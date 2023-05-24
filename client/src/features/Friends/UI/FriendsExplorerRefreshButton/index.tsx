import "./FriendsExplorerRefreshButton.scss";

import RefershIcon from "@mui/icons-material/AutorenewRounded";

import Button from "../../../../shared/UI/Button";
import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import { fetchFriends } from "../../model/store/actionCreators/friendsActions";
import { fetchIncomingFriendRequests } from "../../model/store/actionCreators/incomingFriendRequestsActions";
import { fetchOutcomingFriendRequests } from "../../model/store/actionCreators/outcomingFriendRequests";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";

interface FriendsExplorerRefreshButtonProps {
    explorerTarget: "friend-list" | "incoming-friend-requests" | "outcoming-friend-requests";
}

export default function FriendsExplorerRefreshButton({ explorerTarget }: FriendsExplorerRefreshButtonProps) {
    const [friends, incomingFriendRequests, outcomingFriendRequests] = useTypedSelector((state) => [
        state.friends,
        state.incomingFriendRequests,
        state.outcomingFriendRequests,
    ]);
    const dispatch = useTypedDispatch();

    const { request } = (function () {
        if (explorerTarget === "incoming-friend-requests") {
            return incomingFriendRequests;
        }

        if (explorerTarget === "outcoming-friend-requests") {
            return outcomingFriendRequests;
        }

        return friends;
    })();

    async function friendExplorerRefreshContentButtonClickHandler() {
        if (request.status === "pending") {
            return;
        }

        if (explorerTarget === "friend-list") {
            await dispatch(fetchFriends());
        }

        if (explorerTarget === "incoming-friend-requests") {
            await dispatch(fetchIncomingFriendRequests());
        }

        if (explorerTarget === "outcoming-friend-requests") {
            await dispatch(fetchOutcomingFriendRequests());
        }
    }

    return (
        <Button
            variant="outlined"
            size="small"
            className="TNUI-Friends-explorer-refresh-button"
            onClick={friendExplorerRefreshContentButtonClickHandler}
        >
            <span className="TNUI-Friends-explorer-refresh-button_label">Обновить</span>
            <RefershIcon className="TNUI-Friends-explorer-refresh-button_icon" />
        </Button>
    );
}
