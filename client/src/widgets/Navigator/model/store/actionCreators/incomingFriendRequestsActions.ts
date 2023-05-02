import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import { AppDispatch } from "../../../../../shared/types/store";
import incomingFriendRequestsSlice from "../reducers/incomingFriendRequestsReducer";

export default function addFetchIncomingFriendRequests() {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(incomingFriendRequestsSlice.actions.setRequestStatusToPending());

            const response = await TalkNetAPI.get("/user/friend-requests?type=incoming");

            dispatch(incomingFriendRequestsSlice.actions.setIncominfFriends(response.data));
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch(
                    incomingFriendRequestsSlice.actions.setError(
                        err.response?.data.message ?? "При получении данных о входящих заявках в друзьях произошла ошибка"
                    )
                );
                return;
            }

            dispatch(incomingFriendRequestsSlice.actions.setError("Произошла неуточнённая ошибка"));
        }
    };
}
