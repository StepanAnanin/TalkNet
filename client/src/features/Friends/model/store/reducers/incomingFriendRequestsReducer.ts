import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type IncomingFriendRequestsState = {
    payload: BaseUserData[] | null;
    request: RequestState;
};

const initialState: IncomingFriendRequestsState = {
    payload: null,
    request: { status: "idle", message: null },
};

const incomingFriendRequestsSlice = createSlice({
    name: "incomingFriendRequests",
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
        setIncomingFriends(state, action: PayloadAction<BaseUserData[]>) {
            state.request.status = "succeeded";
            state.request.message = "Данные о входящих заявках в друзья обновлены";

            state.payload = action.payload;
        },
    },
});

export default incomingFriendRequestsSlice;
