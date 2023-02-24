import type User from "../../../../../shared/types/entities/User";
import type { AppDispatch } from "../../../../../shared/types/store";

import TalkNetAPI from "../../../../../shared/api/TalkNetAPI";
import authSlice from "../reducers/authReducer";
import LocalStorageController from "../../../../../shared/lib/LocalStorageController";
import { AxiosError } from "axios";

type loginSuccessRequest = {
    accessToken: string;
    message: string;
    user: User;
};

export function addLogin(email: string, password: string) {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(authSlice.actions.setRequestStatusToPending());

            const response = (await TalkNetAPI.post<loginSuccessRequest>("/user/login", { email, password })).data;

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

            // TODO upd type, it's not User, see loginSuccessRequest
            const user = (await TalkNetAPI.post<User>("/user/refresh")).data;

            dispatch(authSlice.actions.refresh(user));
        } catch (err: any) {
            console.error(err);
            dispatch(authSlice.actions.setError("При обновлении токена доступа произошла ошибка"));
        }
    };
}
