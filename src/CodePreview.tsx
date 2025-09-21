import { convertExcalidrawToJSXElements } from "./parser/convertExcalidrawToJSX";
import { useExcalidraw } from "./excalidraw/hooks";

export const CodePreview = () => {
  const { excalidrawAPI } = useExcalidraw();
  if (!excalidrawAPI) return null;
  const elements = excalidrawAPI.getSceneElements();
  return convertExcalidrawToJSXElements(elements);
};
