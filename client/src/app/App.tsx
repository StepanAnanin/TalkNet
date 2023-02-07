import "./styles/global.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "../shared/lib/errors/ErrorBoundary";

// TODO change dev server port
const HomePage = React.lazy(() => import("../pages/Home"));
const SignUpPage = React.lazy(() => import("../pages/SignUp").then((publicApi) => ({ default: publicApi.SignUpPage })));
const SignInPage = React.lazy(() => import("../pages/SignIn"));

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/*" element={<div>Error 404</div>} />
                    <Route
                        path="/"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <HomePage />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="/signin"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <SignInPage />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <SignUpPage />
                            </React.Suspense>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
