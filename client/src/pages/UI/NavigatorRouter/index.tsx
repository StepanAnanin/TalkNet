import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import NavigatorLayout from "../layouts/NavigatorLayout";
import LoadingPage from "../../Loading";
import ErrorPage404 from "../../Error404";
import { SettingsPageRouter } from "../../Settings";

const MessagesPage = lazy(() => import("../../Messages"));
const SearchPage = lazy(() => import("../../Search"));

// IMPORTANT: In this element correct auth data can't be received from redux store, it just won't be updated (user = null, request status = idle).
//            (I'm not sure what exactly cause this problem)
export default function NavigatorRouter() {
    return (
        <NavigatorLayout>
            <Routes>
                <Route path="*" element={<ErrorPage404 hideHeader />} />
                {/* If user go to path "/n" instead of getting 404 error he will be redirected to messages page */}
                <Route path="/" element={<Navigate to="/n/m" />} />
                <Route
                    path="/m"
                    element={
                        <Suspense fallback={<LoadingPage hideHeader />}>
                            <MessagesPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <Suspense fallback={<LoadingPage hideHeader />}>
                            <SearchPage />
                        </Suspense>
                    }
                />
                <Route path="/settings/*" element={<SettingsPageRouter />} />
            </Routes>
        </NavigatorLayout>
    );
}
