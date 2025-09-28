import { getElementsMap } from "../excalidraw/utils";
import { excalidrawElementToHTML } from "./excalidrawElementToHTML";
import { useExcalidraw } from "../excalidraw/hooks";
import reactElementToJSXString from "react-element-to-jsx-string";
import { buildLayoutTree } from "./buildLayoutTree";

export const useExcalidrawElementsToJSX = () => {
  const { elements } = useExcalidraw();
  const elementsMap = getElementsMap(elements);
  const layoutTree = buildLayoutTree(elements);
  const jsxElements = layoutTree.map((element) =>
    excalidrawElementToHTML(element, elementsMap)
  );
  return jsxElements;
};

export const useExcalidrawToJSXString = () => {
  const { elements } = useExcalidraw();
  const elementsMap = getElementsMap(elements);
  const layoutTree = buildLayoutTree(elements);
  const jsxElements = layoutTree
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
