import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "../shared/lib/errors/ErrorBoundary";

// TODO change dev server port
const HomePage = React.lazy(() => import("../pages/HomePage"));

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
                    <Route path="/login" element={<div>login</div>} />
                    <Route path="/registrate" element={<div>registrate</div>} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
