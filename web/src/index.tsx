import * as React from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.less";
import NotFoundPage from "./NotFoundPage";
import CapturePage from "./CapturePage/index";
import { ClassroomPage } from "./ClassroomPage";
import { ClassroomClientProvider } from "./classroomClient";

const root = createRoot(document.getElementById("root")!);
const serviceLocation = `http://${window.location.hostname}:10000`;

root.render(
    <React.StrictMode>
        <ClassroomClientProvider addr={serviceLocation}>
            <Router>
                <Routes>
                    <Route path="/" element={<ClassroomPage />} />
                    <Route path="/record" element={<CapturePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </ClassroomClientProvider>
    </React.StrictMode>,
);
