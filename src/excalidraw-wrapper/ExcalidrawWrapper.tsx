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
              type: "rectangle",
              x: pointerDownState.origin.x,
              y: pointerDownState.origin.y,
              width: DEFAULT_CONFIG.BUTTON.WIDTH,
              height: DEFAULT_CONFIG.BUTTON.HEIGHT,
              backgroundColor: DEFAULT_CONFIG.BUTTON.BACKGROUND_COLOR,
              customData: {
                type: activeTool.customType,
              },
              label: { text: DEFAULT_CONFIG.BUTTON.TEXT },
            };
            break;
          case UIElement.INPUT:
            customElement = {
              type: "rectangle",
              x: pointerDownState.origin.x,
              y: pointerDownState.origin.y,
              width: DEFAULT_CONFIG.INPUT.WIDTH,
              height: DEFAULT_CONFIG.INPUT.HEIGHT,
              backgroundColor: DEFAULT_CONFIG.INPUT.BACKGROUND_COLOR,
              customData: {
                type: activeTool.customType,
              },
            };
            break;
          case UIElement.LINK:
            customElement = {
              type: "text",
              x: pointerDownState.origin.x,
              y: pointerDownState.origin.y,
              text: DEFAULT_CONFIG.LINK.TEXT,
              customData: {
                type: activeTool.customType,
              },
              strokeColor: "#1971c2",
              fontSize: DEFAULT_CONFIG.LINK.TEXT_FONT_SIZE,
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
