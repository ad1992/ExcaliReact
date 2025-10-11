import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ExcalidrawProvider } from "./excalidraw-wrapper/ExcalidrawProvider.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExcalidrawProvider>
      <App />
      <Analytics />
    </ExcalidrawProvider>
  </StrictMode>
);
