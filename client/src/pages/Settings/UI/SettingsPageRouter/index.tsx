import "../SettingsPage.scss";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ErrorPage404 from "../../../Error404";
import LoadingPage from "../../../Loading";

const SecurityPage = React.lazy(() => import("../../pages/Security"));
const UserPage = React.lazy(() => import("../../pages/User"));

export default function SettingsPageRouter() {
    return (
        <Routes>
            <Route path="*" element={<ErrorPage404 hideHeader />} />
            <Route
                path="/user"
                element={
                    <React.Suspense fallback={<LoadingPage hideHeader />}>
                        <UserPage />
                    </React.Suspense>
                }
            />
            <Route
                path="/security"
                element={
                    <React.Suspense fallback={<LoadingPage hideHeader />}>
                        <SecurityPage />
                    </React.Suspense>
                }
            />
        </Routes>
    );
}
