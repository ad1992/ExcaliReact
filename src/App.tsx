import "./App.css";
import "@excalidraw/excalidraw/index.css";
import { useLayoutEffect, useRef, useState } from "react";
import { CodeEditor } from "./CodeEditor";

import { ExcalidrawWrapper } from "./excalidraw-wrapper/ExcalidrawWrapper";
import {
  CodeIcon,
  FullScreenIcon,
  PreviewIcon,
  RightArrowIcon,
} from "./assets/Icons";
import { ReactIcon } from "./assets/ReactLogo";
import { useExcalidraw } from "./excalidraw-wrapper/hooks";
import { CodePreview } from "./CodePreview";
import { ExperimentalBanner } from "./ExperimentalBanner";

const SCROLL_TO_CONTENT_ANIMATION_DURATION = 500;

function App() {
  const [showCodePanel, setShowCodePanel] = useState<boolean>(false);
  const [showExcaliReactPanel, setShowExcaliReactPanel] =
    useState<boolean>(true);
  const [dividerPosition, setDividerPosition] = useState<number>(50); // percentage

  const { excalidrawAPI } = useExcalidraw();

  const prevShowExcaliReactPanelRef = useRef<boolean | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

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
  // Divider logic
  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newDividerPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newDividerPosition > 10 && newDividerPosition < 90) {
      setDividerPosition(newDividerPosition);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };
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
      <div
        // className="flex-1 flex"
        ref={containerRef}
        className="flex-1 flex overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-100`}
          style={{
            width: showExcaliReactPanel ? `${dividerPosition}%` : "w-full",
          }}
        >
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-l font-semibold text-gray-700">
              Sketch Your Diagram
            </h2>
            <button
              className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded-md text-base flex items-center gap-1 border border-gray-300 shadow-sm excaliFont"
              onClick={handlePreviewPanel}
            >
              {showExcaliReactPanel ? (
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
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition-colors"
        />
        {showExcaliReactPanel && (
          <>
            <div style={{ width: `${100 - dividerPosition}%` }}>
              <div className="flex flex-col bg-white border-r border-gray-200">
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
                <div className="flex flex-1 items-center justify-center overflow-auto p-4 relative ">
                  {showCodePanel ? <CodeEditor /> : <CodePreview />}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
