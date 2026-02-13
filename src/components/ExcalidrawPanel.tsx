import { FullScreenIcon, RightArrowIcon } from "../assets/Icons";
import { ReactIcon } from "../assets/ReactLogo";
import { ExcalidrawWrapper } from "../excalidraw-wrapper/ExcalidrawWrapper";

function ExcalidrawPanel(prop: {
  handlePreviewPanel: () => void;
  showExcaliReactPanel: boolean;
}) {
  const { handlePreviewPanel, showExcaliReactPanel } = prop;
  return (
    <div
      className={`flex flex-col bg-white border-r border-gray-200  w-full ${showExcaliReactPanel ? "md:w-1/2" : ""} h-screen`}
    >
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center ">
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
      <div className="flex-1 w-full h-screen">
        <ExcalidrawWrapper />
      </div>
    </div>
  );
}

export default ExcalidrawPanel;
