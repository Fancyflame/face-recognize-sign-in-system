import * as React from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.less";
import NotFoundPage from "./NotFoundPage";
import CapturePage from "./CapturePage/index";

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                {/* <Route path="/" element={<HomePage />} /> */}
                <Route path="/record" element={<CapturePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
