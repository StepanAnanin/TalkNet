import "./styles/global.scss";
import React from "react";
import WithErrorBoundary from "./core/WithErrorBoundary";
import WithRouter from "./core/WithRouter";
import WithStore from "./core/WithStore";

function App() {
    return (
        <WithErrorBoundary>
            <WithStore>
                <WithRouter />
            </WithStore>
        </WithErrorBoundary>
    );
}

export default App;
