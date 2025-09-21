import { mapExcalidrawElementToHTMLElement } from "./parser/convertExcalidrawToJSX";
import { useExcalidraw } from "./excalidraw/hooks";

export const CodePreview = () => {
  const { excalidrawAPI } = useExcalidraw();
  if (!excalidrawAPI) return null;
  const elements = excalidrawAPI.getSceneElements();
  return (
    <>
      {elements.map((element) => {
        return mapExcalidrawElementToHTMLElement(element);
      })}
    </>
  );
};
