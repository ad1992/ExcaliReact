import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ExcalidrawProvider } from "./excalidraw-wrapper/ExcalidrawProvider.tsx";
import { PostHogProvider } from "posthog-js/react";
import type { PostHogConfig } from "posthog-js";

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <ExcalidrawProvider>
        <App />
      </ExcalidrawProvider>
    </PostHogProvider>
  </StrictMode>
);
