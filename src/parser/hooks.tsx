import { getElementsMap } from "../excalidraw/utils";
import { excalidrawElementToHTML } from "./excalidrawElementToHTML";
import { useExcalidraw } from "../excalidraw/hooks";
import reactElementToJSXString from "react-element-to-jsx-string";
import { buildLayoutTree } from "./buildLayoutTree";
import { computeFrameElementStyle } from "./utils";

export const useExcalidrawElementsToJSX = () => {
  const { elements } = useExcalidraw();
  const elementsMap = getElementsMap(elements);
  const layoutTree = buildLayoutTree(elements);
  const frame = elements.find((element) => element.type === "frame");
  if (!frame) {
    return null;
  }
  const frameStyle = computeFrameElementStyle(frame);
  const jsxElements = layoutTree
    .map((element) => excalidrawElementToHTML(element, elementsMap))
    .filter(Boolean);
  return <div style={frameStyle}>{jsxElements}</div>;
};

export const useExcalidrawToJSXString = () => {
  const jsx = useExcalidrawElementsToJSX();
  const jsxcComp = reactElementToJSXString(<>{jsx}</>, {
    showFunctions: true,
    functionValue: (fn) => fn.toString(),
  });
  return `import React from 'react';
export const ExcalidrawToReact = () => {
  return ${jsxcComp}
};
`;
};
