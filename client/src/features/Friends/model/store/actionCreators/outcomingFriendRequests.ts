import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import { AppDispatch } from "../../../../../shared/types/store";
import outcomingFriendRequestsSlice from "../reducers/outcomingFriendRequestsReducer";

export default function addFetchOutcomingFriendRequests() {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(outcomingFriendRequestsSlice.actions.setRequestStatusToPending());

            const response = await TalkNetAPI.get("/user/friend-requests?type=outcoming");

            dispatch(outcomingFriendRequestsSlice.actions.setOutcomingFriends(response.data));
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch(
                    outcomingFriendRequestsSlice.actions.setError(
                        err.response?.data.message ?? "При получении данных о исходящих заявках в друзьях произошла ошибка"
                    )
                );
                return;
            }

            dispatch(outcomingFriendRequestsSlice.actions.setError("Произошла неуточнённая ошибка"));
        }
    };
}
