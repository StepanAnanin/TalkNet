import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUserData from "../../../../../shared/types/common/BaseUserData";

export const fetchOutcomingFriendRequests = createAsyncThunk<BaseUserData[]>(
    "outcomingFriendRequests/fetchOutcomingFriendRequests",
    async function (args, { rejectWithValue }) {
        try {
            const response = await TalkNetAPI.get("/user/friend-requests?type=outcoming");

            return response.data;
        } catch (err) {
            if (!(err instanceof AxiosError)) {
                throw err;
            }

            return rejectWithValue(
                err.response?.data.message ?? "При получении данных о исходящих заявках в друзьях произошла ошибка"
            );
        }
    }
);
