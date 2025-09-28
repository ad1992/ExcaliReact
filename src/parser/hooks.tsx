import { getElementsMap } from "../excalidraw/utils";
import { excalidrawElementToHTML } from "./excalidrawElementToHTML";
import { useExcalidraw } from "../excalidraw/hooks";
import reactElementToJSXString from "react-element-to-jsx-string";

export const useExcalidrawElementsToJSX = () => {
  const { elements } = useExcalidraw();
  const elementsMap = getElementsMap(elements);
  const jsxElements = elements.map((element) =>
    excalidrawElementToHTML(element, elementsMap)
  );
  return jsxElements;
};

export const useExcalidrawToJSXString = () => {
  const { elements } = useExcalidraw();
  console.log("elements", elements);
  const elementsMap = getElementsMap(elements);
  const jsxElements = elements
    .map(
      (element) => excalidrawElementToHTML(element, elementsMap),
      elementsMap
    )
    .filter(Boolean);
  const jsxcComp = reactElementToJSXString(<>{jsxElements}</>, {
    showFunctions: true,
    functionValue: (fn) => fn.toString(),
  });
  return `import React from 'react';
export const ExcalidrawToReact = () => {
  return ${jsxcComp}
};
`;
};
