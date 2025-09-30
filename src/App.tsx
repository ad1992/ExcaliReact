import "./App.css";
import "@excalidraw/excalidraw/index.css";
import { useState } from "react";
import { CodeEditor } from "./CodeEditor";

import { ExcalidrawWrapper } from "./excalidraw-wrapper/ExcalidrawWrapper";
import { useExcalidrawElementsToJSX } from "./parser/hooks";

function App() {
  const [showCodePanel, setShowCodePanel] = useState<boolean>(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState<boolean>(false);

  const CodePreview = useExcalidrawElementsToJSX();

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
            showPreviewPanel ? "w-1/2" : "w-full"
          }`}
        >
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Draw Your Diagram
            </h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setShowPreviewPanel(!showPreviewPanel)}
            >
              {showPreviewPanel ? "Hide Preview" : "Show Preview"}
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
                <h2 className="text-xl font-semibold text-gray-700">
                  Generated React Code
                </h2>
                <div className="flex items-center gap-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                    Copy Code
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors w-36"
                    onClick={() => setShowCodePanel(!showCodePanel)}
                  >
                    {showCodePanel ? "Back to Preview" : "Switch to Code"}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 relative">
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
