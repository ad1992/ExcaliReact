import "./App.css";
import "@excalidraw/excalidraw/index.css";
import { useLayoutEffect, useRef, useState } from "react";
import { useExcalidraw } from "./excalidraw-wrapper/hooks";
import { ExperimentalBanner } from "./ExperimentalBanner";
import ExcalidrawPanel from "./components/ExcalidrawPanel";
import ReactPanel from "./components/ReactPanel";

const SCROLL_TO_CONTENT_ANIMATION_DURATION = 500;

function App() {
  const [showExcaliReactPanel, setShowExcaliReactPanel] =
    useState<boolean>(true);

  const { excalidrawAPI } = useExcalidraw();

  const prevShowExcaliReactPanelRef = useRef<boolean>(null);

  const handlePreviewPanel = () => {
    prevShowExcaliReactPanelRef.current = showExcaliReactPanel;

    setShowExcaliReactPanel((showExcaliReactPanel) => !showExcaliReactPanel);
  };

  useLayoutEffect(() => {
    if (!excalidrawAPI) return;
    if (prevShowExcaliReactPanelRef.current !== showExcaliReactPanel) {
      // Push the scrollToContent to the next tick to avoid the layout shift due to transition when showExcaliReactPanel is updated
      setTimeout(() => {
        excalidrawAPI.scrollToContent(undefined, {
          animate: true,
          duration: SCROLL_TO_CONTENT_ANIMATION_DURATION,
        });
      }, 0);
    }
  }, [excalidrawAPI, showExcaliReactPanel]);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ExperimentalBanner />
      <header className="bg-white border-b border-gray-200 px-8 py-3 shadow-sm">
        <h1 className="text-3xl font-bold text-center excaliFont">
          <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            ExcaliReact
          </span>
          <span className="text-xl font-normal text-gray-500 ml-3 border-l border-gray-300 pl-3">
            Canvas to React
          </span>
        </h1>
      </header>
      <div className="flex-1 flex flex-col md:flex-row ">
        <ExcalidrawPanel
          handlePreviewPanel={handlePreviewPanel}
          showExcaliReactPanel={showExcaliReactPanel}
        />
        <ReactPanel visible={showExcaliReactPanel} />
      </div>
    </div>
  );
}

export default App;
