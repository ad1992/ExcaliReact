import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ExcalidrawProvider } from "./excalidraw/ExcalidrawProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExcalidrawProvider>
      <App />
    </ExcalidrawProvider>
  </StrictMode>
);
