import type User from "../../../../../shared/types/entities/User";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = {
    user: User | null;
    request: RequestState;
};

const initialState: UserState = { user: null, request: { status: "idle", message: null } };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setRequestStatusToPending(state) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        },
        setError(state, action: PayloadAction<string>) {
            state.request.status = "failed";
            state.request.message = action.payload;
        },
        login(state, action: PayloadAction<User>) {
            state.user = action.payload;

            state.request.status = "succeeded";
        },
        logout(state) {
            state.user = null;

            state.request.status = "succeeded";
        },
        refresh(state, action: PayloadAction<User>) {
            state.user = action.payload;

            state.request.status = "succeeded";
        },
    },
});

export default authSlice;
