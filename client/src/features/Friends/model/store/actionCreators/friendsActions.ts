import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUserData from "../../../../../shared/types/common/BaseUserData";
import { AxiosError } from "axios";

export const fetchFriends = createAsyncThunk<BaseUserData[]>(
    "friends/fetchFriends",
    async function (args, { rejectWithValue }) {
        try {
            const response = await TalkNetAPI.get("/user/friends");

            return response.data;
        } catch (err) {
            if (!(err instanceof AxiosError)) {
                throw err;
            }

            return rejectWithValue(err.response?.data.message ?? "При получении данных о друзьях произошла ошибка");
        }
    }
);
