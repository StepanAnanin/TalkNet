import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchIncomingFriendRequests } from "../actionCreators/incomingFriendRequestsActions";

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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchIncomingFriendRequests.pending, function (state, action) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        });
        builder.addCase(fetchIncomingFriendRequests.rejected, function (state, action) {
            state.request.status = "failed";
            state.request.message = action.payload as string;
        });
        builder.addCase(fetchIncomingFriendRequests.fulfilled, function (state, action) {
            state.request.status = "succeeded";
            state.request.message = "Данные о входящих заявках в друзья обновлены";

            state.payload = action.payload;
        });
    },
});

export default incomingFriendRequestsSlice;
