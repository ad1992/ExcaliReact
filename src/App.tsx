import "./App.css";
import {
  convertToExcalidrawElements,
  Excalidraw,
  Footer,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useState } from "react";
import { CodePreview } from "./CodePreview";
import { useExcalidraw } from "./excalidraw/hooks";
import { CodeEditor } from "./CodeEditor";
import { UIElement, UIElementsDropdown } from "./UIElementsDropdown";
import type {
  ActiveTool,
  PointerDownState,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";

function App() {
  const { excalidrawAPI, setExcalidrawAPI } = useExcalidraw();
  const [previewReactCode, setPreviewReactCode] = useState<boolean>(false);
  const [showCodePanel, setShowCodePanel] = useState<boolean>(false);

  const [selectedUIElement, setSelectedUIElement] = useState<UIElement | null>(
    null
  );
  const handleUIElementSelect = (uiElement: UIElement) => {
    if (!excalidrawAPI) return;
    excalidrawAPI.setActiveTool({
      type: "custom",
      customType: uiElement,
    });

    setSelectedUIElement(uiElement);
  };

  const onPointerDown = (
    activeTool: ActiveTool,
    pointerDownState: PointerDownState
  ) => {
    if (!selectedUIElement || !excalidrawAPI) return;
    let customElement: ExcalidrawElementSkeleton | null = null;
    console.log(
      activeTool.customType === UIElement.BUTTON,
      "active tool custom type"
    );
    if (activeTool.type === "custom") {
      switch (activeTool.customType) {
        case UIElement.BUTTON:
        case UIElement.INPUT:
          customElement = {
            type: "rectangle",
            x: pointerDownState.origin.x,
            y: pointerDownState.origin.y,
            width: 100,
            height: 30,
            customData: {
              type: activeTool.customType,
            },
          };
          break;

        default:
          break;
      }
      if (!customElement) return;
      const customExcalidrawElements = convertToExcalidrawElements([
        customElement,
      ]);
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      console.log(customExcalidrawElements, "custom excalidraw elements");
      excalidrawAPI.updateScene({
        elements: [...elements, ...customExcalidrawElements],
        appState: {
          ...appState,
          selectedElementIds: {
            [customExcalidrawElements[0].id]: true,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Excalidraw to React
        </h1>
      </header>
      <div className="flex-1 flex">
        <div
          className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
            showCodePanel ? "w-1/2" : "w-full"
          }`}
        >
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Draw Your Diagram
            </h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setShowCodePanel(!showCodePanel)}
            >
              {showCodePanel ? "Hide Code" : "Show Code"}
            </button>
          </div>
          <div className="flex-1">
            <Excalidraw
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
              onPointerDown={onPointerDown}
            >
              <Footer>
                <UIElementsDropdown onSelect={handleUIElementSelect} />
              </Footer>
            </Excalidraw>
          </div>
        </div>
        {showCodePanel && (
          <>
            <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  Generated React Code
                </h2>
                <div className="flex items-center gap-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Copy Code
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setPreviewReactCode(!previewReactCode)}
                  >
                    {previewReactCode ? "Code" : "Preview"}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 relative">
                {previewReactCode ? <CodePreview /> : <CodeEditor />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
