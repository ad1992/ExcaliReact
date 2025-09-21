import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createContext } from "react";

export const ExcalidrawContext = createContext<{
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  setExcalidrawAPI: (excalidrawAPI: ExcalidrawImperativeAPI) => void;
  elements: readonly NonDeletedExcalidrawElement[];
  updateElements: (elements: NonDeletedExcalidrawElement[]) => void;
}>({
  excalidrawAPI: null,
  elements: [],
  updateElements: () => {},
  setExcalidrawAPI: () => {},
});
