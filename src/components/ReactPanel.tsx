import { useState } from "react";
import { CodeIcon, PreviewIcon } from "../assets/Icons";
import { CodeEditor } from "../CodeEditor";
import { CodePreview } from "../CodePreview";

function ReactPanel(prop: { visible: boolean }) {
  const { visible } = prop;
  const [showCodePanel, setShowCodePanel] = useState<boolean>(false);
  return (
    <>
      {visible && (
        <div className=" flex flex-col bg-white border-r border-gray-200 w-full md:w-1/2">
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
      )}
    </>
  );
}

export default ReactPanel;
