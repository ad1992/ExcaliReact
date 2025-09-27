import type {
  ElementsMap,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import {
  computeBoundTextElementStyle,
  computeExcalidrawElementStyle,
} from "./utils";
import type { UIElement } from "../UIElementsDropdown";
import {
  getBoundTextElement,
  getContainerElement,
  getElementsMap,
} from "../excalidraw/utils";

interface UIElementType {
  type: "rectangle" | "ellipse" | "text" | UIElement;
}
export const mapExcalidrawElementToHTMLElement = (
  element: NonDeletedExcalidrawElement,
  elementsMap: ElementsMap
) => {
  const baseStyle = computeExcalidrawElementStyle(element);
  const boundTextElement = getBoundTextElement(element, elementsMap);
  const boundTextBaseStyle = boundTextElement
    ? computeBoundTextElementStyle(boundTextElement)
    : {};
  if (element.customData?.type) {
    const customType = element.customData?.type as UIElementType["type"];

    switch (customType) {
      case "button": {
        return (
          <button
            key={element.id}
            style={baseStyle}
            onClick={() => alert(`You clicked on ${boundTextElement?.text}`)}
          >
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </button>
        );
      }
      case "input":
        return <input key={element.id} style={baseStyle} />;
      case "link":
        return (
          <a
            key={element.id}
            style={baseStyle}
            href={boundTextElement?.text}
            target="_blank"
          >
            {boundTextElement?.text}
          </a>
        );
    }
  } else {
    switch (element.type) {
      case "rectangle":
        return (
          <div key={element.id} style={baseStyle}>
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </div>
        );
      case "ellipse":
        return (
          <div key={element.id} style={baseStyle}>
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </div>
        );
      case "text": {
        const container = getContainerElement(element, elementsMap);
        if (container) {
          return;
        }
        return (
          <span key={element.id} style={baseStyle}>
            {element.text}
          </span>
        );
      }
      default:
        return null;
    }
  }
};

export const convertExcalidrawToJSXElements = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const elementsMap = getElementsMap(elements);
  const jsxElements = elements.map((element) =>
    mapExcalidrawElementToHTMLElement(element, elementsMap)
  );
  return jsxElements;
};
