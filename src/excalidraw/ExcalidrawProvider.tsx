import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useCallback, useMemo, useState } from "react";
import { ExcalidrawContext } from "./ExcalidrawContext";

export const ExcalidrawProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const [elements, setElements] = useState<
    readonly NonDeletedExcalidrawElement[]
  >([]);

  const updateElements = useCallback(() => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    setElements(elements);
  }, [excalidrawAPI]);

  const value = useMemo(
    () => ({ excalidrawAPI, setExcalidrawAPI, elements, updateElements }),
    [excalidrawAPI, elements, updateElements]
  );
  return (
    <ExcalidrawContext.Provider value={value}>
      {children}
    </ExcalidrawContext.Provider>
  );
};
