import React from "react";
import { addRefresh } from "../../entities/User";
import TalkNetAPI from "../../shared/api/TalkNetAPI";
import LocalStorageController from "../../shared/lib/LocalStorageController";
import { useTypedDispatch } from "../../shared/model/hooks/useTypedDispatch";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import LoadingPage from "../../pages/Loading";
import { AxiosError } from "axios";

interface WithAPIProps {
    children: React.ReactNode;
}

/**
 * This component adds necessary interceptors from API instance and updating auth data on page loading.
 *
 * Must be placed only in `App.tsx` between `<WithErrorBoundary/>` and `<WithRouter/>`
 *
 * (cuz inside it's used state from global store)
 */
// BUG On very fast page reloading auth data will be lost cuz client unable to update refresh token in time localy,
// but on server refresh token is changed so client has setted old refreshToken.
// Possible solution — don't update refresh token on refreshing access token;
export default function WithAPI({ children }: WithAPIProps) {
    const [isAuthUpdatingInProcess, setIsAuthUpdatingInProcess] = React.useState(false);

    const { payload: user } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();
    const retryRef = React.useRef(false);

    React.useEffect(() => {
        (async function () {
            if (LocalStorageController.accessToken.get() && !user) {
                setIsAuthUpdatingInProcess(true);

                await dispatch(addRefresh());

                setIsAuthUpdatingInProcess(false);
            }
        })();
    }, [user]);

    TalkNetAPI.interceptors.request.use((config) => {
        config.headers!.Authorization = "Bearer " + LocalStorageController.accessToken.get();
        return config;
    });

    TalkNetAPI.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err: AxiosError) => {
            const originalRequest = err.config!;

            // If access token is expired then server attach to
            // request body property "tokenExpired" wich is equal true.
            // @ts-ignore
            if (err.response?.data.tokenExpired && !err.config._isRetry) {
                // @ts-ignore
                originalRequest._isRetry = true;

                try {
                    if (LocalStorageController.accessToken.get() && !retryRef.current) {
                        retryRef.current = true; // idk is this work?
                        await dispatch(addRefresh());
                    }

                    return TalkNetAPI.request(originalRequest);
                } catch (err) {
                    console.error(err);
                } finally {
                    retryRef.current = false;
                }
            }

            throw err;
        }
    );

    if (isAuthUpdatingInProcess) {
        return <LoadingPage />;
    }

    return <>{children}</>;
}
