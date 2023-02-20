import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("../../pages/Home"));
const SignUpPage = lazy(() => import("../../pages/SignUp"));
const SignInPage = lazy(() => import("../../pages/SignIn"));

export default function WithRouter() {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/*" element={<div>Error 404</div>} />
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <HomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/signin"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <SignInPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <SignUpPage />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
