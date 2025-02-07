  import React from "react";
  import { createRoot } from "react-dom/client";
  import App from "./components/app"; 
  import "./index.css";

  const root = createRoot(document.getElementById("root"));

  root.render(
    <React.StrictMode>
      <App /> {/* ✅ Only App is rendered, routing will handle pages */}
    </React.StrictMode>
  );
