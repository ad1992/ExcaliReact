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
      if (element.text.startsWith("btn-")) {
        const btnText = element.text.split("btn-")[1];
        return (
          <button
            key={element.id}
            style={baseStyle}
            onClick={() => alert(`You clicked on ${btnText}`)}
          >
            {btnText}
          </button>
        );
      }

      if (element.text.startsWith("link-")) {
        const linkText = element.text.split("link-")[1];
        return (
          <a key={element.id} style={baseStyle} href={linkText} target="_blank">
            {linkText}
          </a>
        );
      }
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
