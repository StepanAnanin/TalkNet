import "./styles/global.scss";
import React from "react";
import WithErrorBoundary from "./core/WithErrorBoundary";
import WithRouter from "./core/WithRouter";
import WithStore from "./core/WithStore";
import WithAPI from "./core/WithAPI";
import { BrowserRouter } from "react-router-dom";

function App() {
    return (
        <WithErrorBoundary>
            <WithStore>
                <BrowserRouter>
                    <WithAPI>
                        <WithRouter />
                    </WithAPI>
                </BrowserRouter>
            </WithStore>
        </WithErrorBoundary>
    );
}

export default App;
