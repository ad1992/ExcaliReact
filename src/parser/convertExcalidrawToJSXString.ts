import type {
  ElementsMap,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import {
  computeBoundTextElementStyle,
  computeContainerElementStyle,
  computeExcalidrawElementStyle,
} from "./utils";
import type { CSSProperties } from "react";
import {
  getBoundTextElement,
  getContainerElement,
  getElementsMap,
} from "../excalidraw/utils";
import type { UIElementType } from "./types";

/**
 * Stringify the value.
 * @param value - The value to stringify.
 * @returns The stringified value.
 * eg. 100 -> "100"
 * eg. "100" -> "100"
 * eg. true -> "true"
 * eg. false -> "false"
 * eg. null -> ""
 * eg. undefined -> ""
 */
const stringify = (value: unknown) => {
  if (value === null || value === undefined) return "";
  switch (typeof value) {
    case "string":
      return `"${value}"`;
    case "number":
      return `${value}`;
    case "boolean":
      return value.toString();
    default:
      return `"${String(value)}"`;
  }
};

/**
 * Create a style string from a style object.
 * @param style - The style object to create a string from.
 * @returns The style string.
 * eg. { width: 100, height: 100, backgroundColor: "red" } -> { width: 100, height: 100, backgroundColor: "red" }
 */
const createStyleString = (style: CSSProperties): string => {
  const styleEntries = Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}: ${stringify(value)}`);

  return `${styleEntries.length > 0 ? `{ ${styleEntries.join(", ")} }` : "{}"}`;
};

/**
 * Map an Excalidraw element to a JSX string.
 * @param element - The Excalidraw element to map.
 * @returns The JSX string.
 */
export const mapExcalidrawElementToHTMLElementString = (
  element: NonDeletedExcalidrawElement,
  elementsMap: ElementsMap
) => {
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
      case "button":
        return `<button
            key=${stringify(element.id)}
            style={${createStyleString(baseStyle)}}
            onClick={() => alert("You clicked on ${boundTextElement?.text}")}
          >
            ${
              boundTextElement &&
              `<span
              key=${stringify(boundTextElement?.id)}
              style={${createStyleString(boundTextBaseStyle)}}
            >
            ${boundTextElement?.text}
            </span>`
            }
          </button>`;
      case "input":
        return `<input
            key=${stringify(element.id)}
            style={${createStyleString(baseStyle)}}
          />`;
      case "link":
        return `<a
            key=${stringify(element.id)}
            style={${createStyleString(baseStyle)}}
          >
            ${
              boundTextElement &&
              `<span
              key=${stringify(boundTextElement?.id)}
              style={${createStyleString(boundTextBaseStyle)}}
            >
            ${boundTextElement?.text}
            </span>`
            }
          </a>`;
    }
  } else {
    switch (element.type) {
      case "rectangle":
        return `<div
          key=${stringify(element.id)}
          style={${createStyleString(baseStyle)}}
        > 
          ${
            boundTextElement &&
            `<span
            key=${stringify(boundTextElement?.id)}
            style={${createStyleString(boundTextBaseStyle)}}
          >
            ${boundTextElement?.text}
          </span>`
          }
        </div>`;
      case "ellipse":
        return `<div
          key=${stringify(element.id)}
          style={${createStyleString(baseStyle)}}
        >
          ${
            boundTextElement &&
            `<span
            key=${stringify(boundTextElement?.id)}
            style={${createStyleString(boundTextBaseStyle)}}
          >
            ${boundTextElement?.text}
          </span>`
          }
        </div>`;
      case "text": {
        const container = getContainerElement(element, elementsMap);
        if (container) {
          return;
        }
        return `<span
          key=${stringify(element.id)}
          style={${createStyleString(baseStyle)}}
        >
          ${element.text}
        </span>`;
      }
      default:
        return null;
    }
  }
};

export const convertExcalidrawToJSXString = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const elementsMap = getElementsMap(elements);
  const jsxStrings = elements.map((element) =>
    mapExcalidrawElementToHTMLElementString(element, elementsMap)
  );
  return `import React from react;
  export const ExcalidrawToReact = () => {
    return (
      <>
        ${jsxStrings.join("\n")}
      </>
    );
  };
  `;
};
