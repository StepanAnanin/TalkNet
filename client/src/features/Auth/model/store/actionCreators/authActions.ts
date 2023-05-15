import type User from "../../../../../shared/types/entities/User";
import type { AppDispatch } from "../../../../../shared/types/store";

import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import authSlice from "../reducerss/authReducer";
import LocalStorageController from "../../../../../shared/lib/LocalStorageController";
import { AxiosError } from "axios";

type SuccessRequest = {
    accessToken: string;
    message: string;
    user: User;
};

export function addLogin(email: string, password: string) {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(authSlice.actions.setRequestStatusToPending());

            const response = (await TalkNetAPI.post<SuccessRequest>("/user/login", { email, password })).data;

            LocalStorageController.accessToken.set(response.accessToken);

            dispatch(authSlice.actions.login(response.user));
        } catch (err: any) {
            if (err instanceof AxiosError) {
                dispatch(authSlice.actions.setError(err.response?.data.message ?? "Ошибка аутентификации"));
                return;
            }

            dispatch(authSlice.actions.setError("Произошла неуточнённая ошибка"));
        }
    };
}

export function addLogout() {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(authSlice.actions.setRequestStatusToPending());

            await TalkNetAPI.post("/user/logout");

            LocalStorageController.accessToken.reset();

            dispatch(authSlice.actions.logout());
        } catch (err: any) {
            console.error(err);
            dispatch(authSlice.actions.setError("При выходе из аккаунта произошла ошибка"));
        }
    };
}

/**
 * Updating refresh and access tokens, require user to be authenticated.
 */
export function addRefresh() {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(authSlice.actions.setRequestStatusToPending());

            const response = (await TalkNetAPI.post<SuccessRequest>("/user/refresh")).data;

            LocalStorageController.accessToken.set(response.accessToken);

            dispatch(authSlice.actions.refresh(response.user));

            console.log("Access token refreshed");
        } catch (err: any) {
            console.error(err);
            dispatch(authSlice.actions.setError("При обновлении токена доступа произошла ошибка"));
        }
    };
}
