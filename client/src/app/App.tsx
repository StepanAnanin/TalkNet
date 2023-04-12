import "./styles/global.scss";
import React from "react";
import WithErrorBoundary from "./core/WithErrorBoundary";
import WithRouter from "./core/WithRouter";
import WithStore from "./core/WithStore";
import WithAPI from "./core/WithAPI";
import { BrowserRouter } from "react-router-dom";
import WithGlobal from "./core/WithGlobal";

function App() {
    return (
        <WithStore>
            <WithGlobal>
                <BrowserRouter>
                    <WithErrorBoundary>
                        <WithAPI>
                            <WithRouter />
                        </WithAPI>
                    </WithErrorBoundary>
                </BrowserRouter>
            </WithGlobal>
        </WithStore>
    );
}

export default App;
