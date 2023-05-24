import type User from "../../../../../shared/types/entities/User";

import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import LocalStorageController from "../../../../../shared/lib/LocalStorageController";
import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

type SuccessRequest = {
    accessToken: string;
    message: string;
    user: User;
};

export const login = createAsyncThunk<User, { email: string; password: string }>(
    "auth/login",
    async function ({ email, password }, { rejectWithValue }) {
        try {
            const response = await TalkNetAPI.post<SuccessRequest>("/user/login", { email, password });

            LocalStorageController.accessToken.set(response.data.accessToken);

            return response.data.user;
        } catch (err) {
            if (!(err instanceof AxiosError)) {
                throw err;
            }

            return rejectWithValue(err.response?.data.message ?? "Ошибка аутентификации");
        }
    }
);

export const logout = createAsyncThunk<string>("auth/logout", async function (args, { rejectWithValue }) {
    try {
        const response = await TalkNetAPI.post<SuccessRequest>("/user/logout");

        LocalStorageController.accessToken.reset();

        return response.data.message;
    } catch (err) {
        if (!(err instanceof AxiosError)) {
            throw err;
        }

        return rejectWithValue(err.response?.data.message ?? "Ошибка деаутентификации");
    }
});

export const refreshAuth = createAsyncThunk<User>("auth/refresh", async function (args, { rejectWithValue }) {
    try {
        const response = await TalkNetAPI.post<SuccessRequest>("/user/refresh");

        LocalStorageController.accessToken.set(response.data.accessToken);

        console.log("Access token refreshed");

        return response.data.user;
    } catch (err) {
        if (!(err instanceof AxiosError)) {
            throw err;
        }

        return rejectWithValue(err.response?.data.message ?? "При обновлении токена доступа произошла ошибка");
    }
});
