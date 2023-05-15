import type User from "../../../../../shared/types/entities/User";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
    payload: User | null;
    request: RequestState;
};

const initialState: AuthState = { payload: null, request: { status: "idle", message: null } };

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
            state.payload = action.payload;

            state.request.status = "succeeded";
            state.request.message = "Аутентификация успешна";
        },
        logout(state) {
            state.payload = null;

            state.request.status = "succeeded";
            state.request.message = "Деаутентификация успешна";
        },
        refresh(state, action: PayloadAction<User>) {
            state.payload = action.payload;

            state.request.status = "succeeded";
            state.request.message = "Токены обновлены";
        },
    },
});

export default authSlice;
