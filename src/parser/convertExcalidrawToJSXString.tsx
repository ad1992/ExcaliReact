import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

import { getElementsMap } from "../excalidraw/utils";
import { mapExcalidrawElementToHTMLElement } from "./convertExcalidrawToJSX";
import reactElementToJSXString from "react-element-to-jsx-string";

export const convertExcalidrawToJSXString = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const elementsMap = getElementsMap(elements);
  const jsxElements = elements
    .map(
      (element) => mapExcalidrawElementToHTMLElement(element, elementsMap),
      elementsMap
    )
    .filter(Boolean);
  return `import React from react;
  export const ExcalidrawToReact = () => {
    return ${reactElementToJSXString(<>{jsxElements}</>, { showFunctions: true, functionValue: (fn) => fn.toString() })}
  };
  `;
};
