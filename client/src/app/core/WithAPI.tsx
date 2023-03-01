import React from "react";
import { addRefresh } from "../../entities/User";
import TalkNetAPI from "../../shared/api/TalkNetAPI";
import LocalStorageController from "../../shared/lib/LocalStorageController";
import { useTypedDispatch } from "../../shared/model/hooks/useTypedDispatch";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import LoadingPage from "../../pages/Loading";

interface WithAPIProps {
    children: React.ReactNode;
}

/**
 * This component adds necessary interceptors from API instance and updating auth data on page loading.
 *
 * Must be placed only in `App.tsx` between `<WithStore/>` and `<WithRouter/>`
 *
 * (cuz inside it's used state from global store)
 */
export default function WithAPI({ children }: WithAPIProps) {
    const [isAuthUpdatingInProcess, setIsAuthUpdatingInProcess] = React.useState(false);

    const { user } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();

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

    // TODO need to test this
    TalkNetAPI.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalRequest = err.config;

            if (err.response.status === 401 && err.config && !err.config._isRetry) {
                originalRequest._isRetry = true;

                try {
                    if (user && LocalStorageController.accessToken.get()) {
                        console.log(`Access token expired`);
                        await dispatch(addRefresh());
                    }

                    return TalkNetAPI.request(originalRequest);
                } catch (err) {
                    console.error(err);
                }
            }

            throw err;
        }
    );

    if (isAuthUpdatingInProcess) {
        // TODO replace this with loading page
        return <LoadingPage />;
    }

    return <>{children}</>;
}
