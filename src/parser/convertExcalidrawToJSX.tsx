import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { computeExcalidrawElementStyle } from "./utils";

export const mapExcalidrawElementToHTMLElement = (
  element: NonDeletedExcalidrawElement
) => {
  const baseStyle = computeExcalidrawElementStyle(element);

  switch (element.type) {
    case "rectangle":
      return <div key={element.id} style={baseStyle} />;
    case "ellipse":
      return <div key={element.id} style={baseStyle} />;
    case "text":
      return (
        <span key={element.id} style={baseStyle}>
          {element.text}
        </span>
      );
    default:
      return null;
  }
};

export const convertExcalidrawToJSXElements = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const jsxElements = elements.map((element) =>
    mapExcalidrawElementToHTMLElement(element)
  );
  return jsxElements;
};
