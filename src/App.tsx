import "./App.css";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Excalidraw to React
        </h1>
      </header>
      <div className="flex-1 flex">
        <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Draw Your Diagram
            </h2>
          </div>
          <div className="flex-1">
            <Excalidraw />
          </div>
        </div>
        <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Generated React Code
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Copy Code
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 m-0 font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap break-words overflow-x-auto">
              <code>Code</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
