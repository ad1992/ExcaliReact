import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { computeExcalidrawElementStyle } from "./utils";
import type { CSSProperties } from "react";

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
  element: NonDeletedExcalidrawElement
) => {
  const baseStyle = computeExcalidrawElementStyle(element);

  switch (element.type) {
    case "rectangle":
      return `<div
          key=${stringify(element.id)}
            style={${createStyleString(baseStyle)}}
        />`;
      break;
    case "ellipse":
      return `<div
          key=${stringify(element.id)}
          style={${createStyleString(baseStyle)}}
        />`;

      break;
    default:
      return null;
  }
};

export const convertExcalidrawToJSXString = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const jsxCode = elements.map((element) =>
    mapExcalidrawElementToHTMLElementString(element)
  );
  return `import React from react;
  export const ExcalidrawToReact = () => {
    return (
      <>
        ${jsxCode.join("\n")}
      </>
    );
  };
  `;
};
