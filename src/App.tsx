import "./App.css";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CodeEditor } from "./CodeEditor";

import { ExcalidrawWrapper } from "./excalidraw-wrapper/ExcalidrawWrapper";
import { useExcalidrawElementsToJSX } from "./parser/hooks";
import {
  CodeIcon,
  FullScreenIcon,
  PreviewIcon,
  RightArrowIcon,
} from "./assets/Icons";
import { ReactIcon } from "./assets/ReactLogo";
import { useExcalidraw } from "./excalidraw-wrapper/hooks";

function App() {
  const [showCodePanel, setShowCodePanel] = useState<boolean>(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState<boolean>(false);

  const CodePreview = useExcalidrawElementsToJSX();
  const { excalidrawAPI } = useExcalidraw();

  const prevShowPreviewPanelRef = useRef<boolean>(null);

  const handlePreviewPanel = () => {
    prevShowPreviewPanelRef.current = showPreviewPanel;

    setShowPreviewPanel((showPreviewPanel) => !showPreviewPanel);
  };

  useLayoutEffect(() => {
    if (!excalidrawAPI) return;
    if (prevShowPreviewPanelRef.current !== showPreviewPanel) {
      // Push the scrollToContent to the next tick to avoid the layout shift due to transition when showPreviewPanel is updated
      setTimeout(() => {
        excalidrawAPI.scrollToContent();
      }, 0);
    }
  }, [excalidrawAPI, showPreviewPanel]);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-3 shadow-sm">
        <h1 className="text-2xl font-bold text-center excaliFont">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ExcaliReact
          </span>
          <span className="text-base font-normal text-gray-500 ml-3 border-l border-gray-300 pl-3">
            Sketch to React
          </span>
        </h1>
      </header>
      <div className="flex-1 flex">
        <div
          className={`flex flex-col bg-white border-r border-gray-200 ${
            showPreviewPanel ? "w-1/2" : "w-full"
          }`}
        >
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-l font-semibold text-gray-700">
              Sketch Your Diagram
            </h2>
            <button
              className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded-md text-base flex items-center gap-1 border border-gray-300 shadow-sm excaliFont"
              onClick={handlePreviewPanel}
            >
              {showPreviewPanel ? (
                <>
                  <FullScreenIcon />
                  Sketch
                </>
              ) : (
                <>
                  Excalidraw <RightArrowIcon /> React <ReactIcon />
                </>
              )}
            </button>
          </div>
          <div className="flex-1">
            <ExcalidrawWrapper />
          </div>
        </div>
        {showPreviewPanel && (
          <>
            <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-l font-semibold text-gray-700">
                  ExcaliReact App
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded-md text-xs flex items-center gap-1 border border-gray-300 shadow-sm"
                    onClick={() => setShowCodePanel(!showCodePanel)}
                  >
                    <div className="flex items-center gap-2">
                      {showCodePanel ? (
                        <>
                          <PreviewIcon />
                          Preview
                        </>
                      ) : (
                        <>
                          <CodeIcon />
                          Code
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 relative ">
                {showCodePanel ? <CodeEditor /> : CodePreview}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
