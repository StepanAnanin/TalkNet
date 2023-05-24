import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchOutcomingFriendRequests } from "../actionCreators/outcomingFriendRequests";

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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOutcomingFriendRequests.pending, function (state, action) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        });
        builder.addCase(fetchOutcomingFriendRequests.rejected, function (state, action) {
            state.request.status = "failed";
            state.request.message = action.payload as string;
        });
        builder.addCase(fetchOutcomingFriendRequests.fulfilled, function (state, action) {
            state.request.status = "succeeded";
            state.request.message = "Данные о исходящих заявках в друзья обновлены";

            state.payload = action.payload;
        });
    },
});

export default outcomingFriendRequestsSlice;
