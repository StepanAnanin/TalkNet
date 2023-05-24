import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchFriends } from "../actionCreators/friendsActions";

type FriendsState = {
    payload: BaseUserData[] | null;
    request: RequestState;
};

const initialState: FriendsState = { payload: null, request: { status: "idle", message: null } };

const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        // deleteFriendLocaly(state, action: PayloadAction<string>) {
        //
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFriends.pending, function (state, action) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        });
        builder.addCase(fetchFriends.rejected, function (state, action) {
            state.request.status = "failed";
            state.request.message = action.payload as string;
        });
        builder.addCase(fetchFriends.fulfilled, function (state, action) {
            state.payload = action.payload;

            state.request.status = "succeeded";
            state.request.message = "Данные о друзьях обновлены";
        });
    },
});

export default friendsSlice;
