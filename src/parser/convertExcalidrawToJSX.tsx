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
    case "text":
      return (
        <span key={element.id} style={baseStyle}>
          {element.text}
        </span>
      );
      break;
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
