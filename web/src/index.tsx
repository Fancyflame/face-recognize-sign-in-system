import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css";
import NotFoundPage from "./NotFoundPage";
import CapturePage from "./CapturePage";

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
