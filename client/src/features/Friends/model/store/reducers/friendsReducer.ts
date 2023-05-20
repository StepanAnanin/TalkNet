import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FriendsState = {
    payload: BaseUserData[] | null;
    request: RequestState;
};

const initialState: FriendsState = { payload: null, request: { status: "idle", message: null } };

const friendsSlice = createSlice({
    name: "friends",
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
        setFriends(state, action: PayloadAction<BaseUserData[]>) {
            state.payload = action.payload;

            state.request.status = "succeeded";
            state.request.message = "Данные о друзьях обновлены";
        },
    },
});

export default friendsSlice;
