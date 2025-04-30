import * as React from "react";
import { createRoot } from "react-dom/client";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import "./index.less";
import NotFoundPage from "./NotFoundPage";
import { ClassroomPage } from "./ClassroomPage";
import { ClassroomClientProvider } from "./classroomClient";
import { SignInPage } from "./SignInPage";
import { CreateStudentPage } from "./CreateStudentPage";
import { FaceApiLocalProvider } from "./faceApiLocal";

const root = createRoot(document.body);
const serviceLocation = `http://${window.location.hostname}:10000`;

root.render(
    <React.StrictMode>
        <ClassroomClientProvider addr={serviceLocation}>
            <FaceApiLocalProvider modelPath="../models">
                <Router>
                    <Routes>
                        <Route path="/" element={<ClassroomPage />} />
                        {/* <Route path="/record" element={<CapturePage />} /> */}
                        <Route
                            path="/createStudent"
                            element={<CreateStudentPage />}
                        />
                        <Route
                            path="/classroom/:roomId"
                            element={<SignInPage />}
                        />
                        <Route
                            path="/classroom"
                            element={<Navigate to="/" replace />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Router>
            </FaceApiLocalProvider>
        </ClassroomClientProvider>
    </React.StrictMode>,
);
