import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { computeExcalidrawElementStyle } from "./utils";

export const mapExcalidrawElementToHTMLElement = (
  element: NonDeletedExcalidrawElement
) => {
  const baseStyle = computeExcalidrawElementStyle(element);
  switch (element.type) {
    case "rectangle":
      return <div key={element.id} style={baseStyle} />;
      break;
    case "ellipse":
      return <div key={element.id} style={baseStyle} />;
      break;
    default:
      return null;
  }
};

export const convertExcalidrawToJSXElements = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const jsxCode = elements.map((element) =>
    mapExcalidrawElementToHTMLElement(element)
  );
  return `import React from react;
  export const ExcalidrawToReact = () => {
    return (
      <>
        ${jsxCode.join("")}
      </>
    );
  };
  `;
};
