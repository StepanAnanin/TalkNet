import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUserData from "../../../../../shared/types/common/BaseUserData";

export const fetchIncomingFriendRequests = createAsyncThunk<BaseUserData[]>(
    "incomingFriendRequests/fetchIncomingFriendRequests",
    async function (args, { rejectWithValue }) {
        try {
            const response = await TalkNetAPI.get("/user/friend-requests?type=incoming");

            return response.data;
        } catch (err) {
            if (!(err instanceof AxiosError)) {
                throw err;
            }

            return rejectWithValue(
                err.response?.data.message ?? "При получении данных о входящих заявках в друзьях произошла ошибка"
            );
        }
    }
);
