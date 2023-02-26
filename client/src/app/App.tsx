import "./styles/global.scss";
import React from "react";
import WithErrorBoundary from "./core/WithErrorBoundary";
import WithRouter from "./core/WithRouter";
import WithStore from "./core/WithStore";
import WithAPI from "./core/WithAPI";

function App() {
    return (
        <WithErrorBoundary>
            <WithStore>
                <WithAPI>
                    <WithRouter />
                </WithAPI>
            </WithStore>
        </WithErrorBoundary>
    );
}

export default App;
