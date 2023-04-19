import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "../../pages/Loading";
import ErrorPage404 from "../../pages/Error404";

const HomePage = lazy(() => import("../../pages/Home"));
const SignUpPage = lazy(() => import("../../pages/SignUp"));
const SignInPage = lazy(() => import("../../pages/SignIn"));
const MessagesPage = lazy(() => import("../../pages/Messages"));
const SearchPage = lazy(() => import("../../pages/Search"));

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
            <Route
                path="/m"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <MessagesPage />
                    </Suspense>
                }
            />
            <Route
                path="/search"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <SearchPage />
                    </Suspense>
                }
            />
        </Routes>
    );
}
