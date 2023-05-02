import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import { AppDispatch } from "../../../../../shared/types/store";
import friendsSlice from "../reducers/friendsReducer";

export default function addFetchFriends() {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(friendsSlice.actions.setRequestStatusToPending());

            const response = await TalkNetAPI.get("/user/friends");

            dispatch(friendsSlice.actions.setFriends(response.data));
        } catch (err) {
            if (err instanceof AxiosError) {
                dispatch(
                    friendsSlice.actions.setError(
                        err.response?.data.message ?? "При получении данных о друзьях произошла ошибка"
                    )
                );
                return;
            }

            dispatch(friendsSlice.actions.setError("Произошла неуточнённая ошибка"));
        }
    };
}
