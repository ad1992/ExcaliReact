import "./App.css";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useState } from "react";
import { CodePreview } from "./CodePreview";
import { useExcalidraw } from "./excalidraw/hooks";
import { CodeEditor } from "./CodeEditor";

function App() {
  const { setExcalidrawAPI } = useExcalidraw();
  const [previewReactCode, setPreviewReactCode] = useState<boolean>(false);
  const [showCodePanel, setShowCodePanel] = useState<boolean>(false);

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
            <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
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
