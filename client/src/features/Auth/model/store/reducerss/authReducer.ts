import type User from "../../../../../shared/types/entities/User";
import type { RequestState } from "../../../../../shared/types/common/RequestState";

import { createSlice } from "@reduxjs/toolkit";
import { login, logout, refreshAuth } from "../actionCreators/authActions";

type AuthState = {
    payload: User | null;
    request: RequestState;
};

const initialState: AuthState = { payload: null, request: { status: "idle", message: null } };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ============= login =============

        builder.addCase(login.pending, function (state, action) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        });

        builder.addCase(login.rejected, function (state, action) {
            state.request.status = "failed";
            state.request.message = action.payload as string;
        });

        builder.addCase(login.fulfilled, function (state, action) {
            state.payload = action.payload;

            state.request.status = "succeeded";
            state.request.message = "Аутентификация успешна";
        });

        // ============= logout =============

        builder.addCase(logout.pending, function (state, action) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        });

        builder.addCase(logout.rejected, function (state, action) {
            state.request.status = "failed";
            state.request.message = action.payload as string;
        });

        builder.addCase(logout.fulfilled, function (state, action) {
            state.payload = null;

            state.request.status = "succeeded";
            state.request.message = "Деаутентификация успешна";
        });

        // ============= refresh =============

        builder.addCase(refreshAuth.pending, function (state, action) {
            state.request.status = "pending";
            state.request.message = "Ожидание ответа от сервера";
        });

        builder.addCase(refreshAuth.rejected, function (state, action) {
            state.request.status = "failed";
            state.request.message = action.payload as string;
        });

        builder.addCase(refreshAuth.fulfilled, function (state, action) {
            state.payload = action.payload;

            state.request.status = "succeeded";
            state.request.message = "Токены обновлены";
        });
    },
});

export default authSlice;
