import {
  convertToExcalidrawElements,
  Excalidraw,
  Footer,
} from "@excalidraw/excalidraw";
import { UIElementsDropdown } from "../UIElementsDropdown";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import type {
  ActiveTool,
  PointerDownState,
} from "@excalidraw/excalidraw/types";
import { initialData } from "../initialData";
import { useExcalidraw } from "./hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { UIElement } from "../types";
import { DEFAULT_CONFIG } from "../constants";

export const ExcalidrawWrapper = () => {
  const { excalidrawAPI, setExcalidrawAPI, elements, setElements } =
    useExcalidraw();
  const [selectedUIElement, setSelectedUIElement] = useState<UIElement | null>(
    null
  );
  const currentVersionNonceRef = useRef<number>(0);

  useEffect(() => {
    currentVersionNonceRef.current = elements.reduce((acc, element) => {
      return acc + element.versionNonce;
    }, 0);
  }, [elements]);

  const handleOnChange = useCallback(
    (updatedElements: readonly NonDeletedExcalidrawElement[]) => {
      updatedElements = updatedElements.filter((element) => !element.isDeleted);

      if (updatedElements.length !== elements.length) {
        setElements(updatedElements);
        return;
      }
      const updatedVersionNonce = updatedElements.reduce((acc, element) => {
        return acc + element.versionNonce;
      }, 0);
      if (updatedVersionNonce === currentVersionNonceRef.current) return;
      setElements(updatedElements);
    },
    [elements.length, setElements]
  );

  const onPointerDown = useCallback(
    (activeTool: ActiveTool, pointerDownState: PointerDownState) => {
      if (!selectedUIElement || !excalidrawAPI) return;
      let customElement: ExcalidrawElementSkeleton | null = null;

      if (activeTool.type === "custom") {
        switch (activeTool.customType) {
          case UIElement.BUTTON:
            customElement = {
              ...DEFAULT_CONFIG.BUTTON,
              type: "rectangle",
              x: pointerDownState.origin.x - DEFAULT_CONFIG.BUTTON.width / 2,
              y: pointerDownState.origin.y - DEFAULT_CONFIG.BUTTON.height / 2,
            };
            break;
          case UIElement.INPUT:
            customElement = {
              ...DEFAULT_CONFIG.INPUT,
              type: "rectangle",
              x: pointerDownState.origin.x - DEFAULT_CONFIG.INPUT.width / 2,
              y: pointerDownState.origin.y - DEFAULT_CONFIG.INPUT.height / 2,
            };
            break;
          case UIElement.LINK:
            customElement = {
              ...DEFAULT_CONFIG.LINK,
              type: "text",
              x: pointerDownState.origin.x - DEFAULT_CONFIG.LINK.width / 2,
              y: pointerDownState.origin.y - DEFAULT_CONFIG.LINK.height / 2,
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
    },
    [excalidrawAPI, selectedUIElement]
  );

  const handleUIElementSelect = useCallback(
    (uiElement: UIElement) => {
      if (!excalidrawAPI) return;
      if (uiElement === UIElement.TEXT) {
        excalidrawAPI.setActiveTool({
          type: "text",
        });
        return;
      }
      if (uiElement === UIElement.FRAME) {
        excalidrawAPI.setActiveTool({
          type: "frame",
        });
        return;
      }
      excalidrawAPI.setActiveTool({
        type: "custom",
        customType: uiElement,
      });

      setSelectedUIElement(uiElement);
    },
    [excalidrawAPI, setSelectedUIElement]
  );

  return (
    <Excalidraw
      excalidrawAPI={(api) => setExcalidrawAPI(api)}
      onPointerDown={onPointerDown}
      initialData={initialData}
      onChange={handleOnChange}
    >
      <Footer>
        <UIElementsDropdown onSelect={handleUIElementSelect} />
      </Footer>
    </Excalidraw>
  );
};
