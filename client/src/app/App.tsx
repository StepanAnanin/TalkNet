import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/*" element={<div>Error 404</div>} />
                <Route path="/" element={<div>1</div>} />
                <Route path="/test" element={<div>2</div>} />
                <Route path="/asd" element={<div>3</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
