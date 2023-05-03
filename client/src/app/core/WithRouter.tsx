import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "../../pages/Loading";
import ErrorPage404 from "../../pages/Error404";
import { NavigatorRouter } from "../../pages";

const HomePage = lazy(() => import("../../pages/Home"));
const SignUpPage = lazy(() => import("../../pages/SignUp"));
const SignInPage = lazy(() => import("../../pages/SignIn"));

export default function WithRouter() {
    return (
        <Routes>
            <Route path="/*" element={<ErrorPage404 />} />
            <Route
                path="/"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <HomePage />
                    </Suspense>
                }
            />
            <Route
                path="/signin"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <SignInPage />
                    </Suspense>
                }
            />
            <Route
                path="/signup"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <SignUpPage />
                    </Suspense>
                }
            />
            <Route path="/n/*" element={<NavigatorRouter />} />
        </Routes>
    );
}
