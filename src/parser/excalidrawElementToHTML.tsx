import type {
  ElementsMap,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import { getBoundTextElement, getContainerElement } from "../excalidraw/utils";
import {
  computeBoundTextElementStyle,
  computeContainerElementStyle,
  computeExcalidrawElementStyle,
} from "./utils";
import type { GroupNode, UIElementType } from "./types";

/**
 * Convert an Excalidraw element to an HTML element.
 * @param element The Excalidraw element to convert.
 * @param elementsMap The elements map.
 * @returns The equivalent HTML element.
 */
export const excalidrawElementToHTML = (
  element: GroupNode | NonDeletedExcalidrawElement,
  elementsMap: ElementsMap
): React.ReactNode => {
  if (element.type === "group") {
    return (
      <div
        key={element.id}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          position: "relative",
        }}
      >
        {element.children.map((child) =>
          excalidrawElementToHTML(child, elementsMap)
        )}
      </div>
    );
  }

  const boundTextElement = getBoundTextElement(element, elementsMap);
  const boundTextBaseStyle = boundTextElement
    ? computeBoundTextElementStyle(boundTextElement)
    : {};
  const baseStyle = boundTextElement
    ? computeContainerElementStyle(element)
    : computeExcalidrawElementStyle(element);

  if (element.customData?.type) {
    const customType = element.customData?.type as UIElementType["type"];

    switch (customType) {
      case "button": {
        return (
          <button
            key={element.id}
            style={baseStyle}
            name={boundTextElement?.text}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              alert(`You clicked on ${event.currentTarget.name}`)
            }
          >
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </button>
        );
      }
      case "input":
        return <input key={element.id} style={baseStyle} id={element.id} />;
      case "link":
        if (element.type !== "text") return null;
        return (
          <a
            key={element.id}
            style={baseStyle}
            href={element.text}
            target="_blank"
          >
            {element.text}
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
          return null;
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
