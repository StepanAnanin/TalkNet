import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type OutcomingFriendRequestsState = {
    payload: BaseUserData[] | null;
    request: RequestState;
};

const initialState: OutcomingFriendRequestsState = {
    payload: null,
    request: { status: "idle", message: null },
};

const outcomingFriendRequestsSlice = createSlice({
    name: "outcomingFriendRequests",
    initialState,
    reducers: {
        setRequestStatusToIdle(state) {
            state.request.status = "idle";
            state.request.message = null;
        },
        setRequestStatusToPending(state) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        },
        setError(state, action: PayloadAction<string>) {
            state.request.status = "failed";
            state.request.message = action.payload;
        },
        setOutcomingFriends(state, action: PayloadAction<BaseUserData[]>) {
            state.request.status = "succeeded";
            state.request.message = "Данные о исходящих заявках в друзья обновлены";

            state.payload = action.payload;
        },
    },
});

export default outcomingFriendRequestsSlice;
