import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export const mapExcalidrawElementToHTMLElement = (
  element: NonDeletedExcalidrawElement
) => {
  switch (element.type) {
    case "rectangle":
      return (
        <div
          key={element.id}
          style={{
            width: element.width,
            height: element.height,
            backgroundColor: element.backgroundColor,
            borderRadius: String(element.roundness),
            border: `${element.strokeWidth}px solid ${element.strokeColor}`,
            position: "absolute",
            left: element.x,
            top: element.y,
          }}
        />
      );
      break;
    case "ellipse":
      return (
        <div
          key={element.id}
          style={{
            width: element.width,
            height: element.height,
            backgroundColor: element.backgroundColor,
            borderRadius: String(element.roundness),
            border: `${element.strokeWidth}px solid ${element.strokeColor}`,
            position: "absolute",
            left: element.x,
            top: element.y,
          }}
        />
      );
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
