import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { getCornerRadius, getFontString } from "../excalidraw-wrapper/utils";
import type { CSSProperties } from "react";
import { VERTICAL_ALIGN } from "../excalidraw-wrapper/constants";
import { FONT_FAMILY } from "@excalidraw/excalidraw";
import type { GroupNode, TreeNode, TreeNodeElement } from "./types";

/**
 * Compute the style of an Excalidraw element.
 * @param element - The Excalidraw element to compute the style for.
 * @returns The style of the Excalidraw element.
 * @example
 * const element = {
 *   type: "rectangle",
 *   width: 100,
 *   height: 100,
 *   backgroundColor: "red",
 *   strokeWidth: 1,
 *   strokeColor: "black",
 *   x: 0,
 *   y: 0,
 * };
 * const style = computeExcalidrawElementStyle(element);
 * console.log(style);
 * // { width: 100, height: 100, backgroundColor: "red", border: "1px solid black", borderRadius: 0 }
 */
export const computeExcalidrawElementStyle = (
  element: NonDeletedExcalidrawElement
): CSSProperties => {
  const borderRadius = getCornerRadius(
    Math.min(element.width, element.height),
    element
  );
  const baseStyle: CSSProperties = {
    width: element.width,
    height: element.height,
    backgroundColor: element.backgroundColor,
    border: `${element.strokeWidth}px solid ${element.strokeColor}`,
    borderRadius,
  };
  switch (element.type) {
    case "rectangle":
      return baseStyle;
    case "ellipse":
      return { ...baseStyle, borderRadius: "50%" };
    case "text":
      return {
        ...baseStyle,
        border: "none",
        backgroundColor: "transparent",
        font: getFontString({
          fontSize: element.fontSize ?? 16,
          fontFamily: element.fontFamily ?? FONT_FAMILY.Assistant,
        }),
        color: element.strokeColor ?? "black",
        textAlign: element.textAlign as CSSProperties["textAlign"],
        verticalAlign: element.verticalAlign ?? VERTICAL_ALIGN.TOP,
      };
    default:
      return baseStyle;
  }
};

export const computeBoundTextElementStyle = (
  element: NonDeletedExcalidrawElement
) => {
  // Destruct left, top, position, width, height as they aren't needed for bound text element
  // eslint-disable-next-line
  const { left, top, position, width, height, ...restStyles } =
    computeExcalidrawElementStyle(element);

  return {
    ...restStyles,
    border: "none",
    backgroundColor: "transparent",
  };
};

export const computeContainerElementStyle = (
  element: NonDeletedExcalidrawElement
) => {
  const baseStyle = computeExcalidrawElementStyle(element);
  baseStyle.display = "flex";
  baseStyle.alignItems = "center";
  baseStyle.justifyContent = "center";
  return baseStyle;
};

export const computeFrameElementStyle = (
  element: TreeNodeElement
): CSSProperties => {
  const normalizedElement = normalizeFrameElement(element);
  const { padding = { left: 0, top: 0, right: 0, bottom: 0 } } =
    normalizedElement;
  return {
    position: "relative",
    margin: "0 auto",
    width: normalizedElement.width,
    height: normalizedElement.height,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    border: `${normalizedElement.strokeWidth}px solid ${normalizedElement.strokeColor}`,
  };
};
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

/***
 * Normalize the element by rounding the x, y, width, and height to the nearest integer
 * @param element - The element to normalize
 * @returns The normalized element
 */
export const normalizeElement = (
  element: GroupNode | NonDeletedExcalidrawElement
) => {
  return {
    ...element,
    x: Math.round(element.x),
    y: Math.round(element.y),
    width: Math.round(element.width),
    height: Math.round(element.height),
  };
};

export const normalizeFrameElement = (element: TreeNodeElement) => {
  return {
    ...element,
    x: Math.round(element.x),
    y: Math.round(element.y),
    width: Math.round(element.width),
    height: Math.round(element.height),
  };
};

export const computeMarginsForElement = <
  T extends { x: number; y: number; width: number; height: number },
>(
  element: T & Required<Pick<T, "x" | "y" | "width" | "height">>,
  prevElement: (T & Required<Pick<T, "x" | "y" | "width" | "height">>) | null,
  isNewRow: boolean
) => {
  if (!prevElement) {
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }
  if (isNewRow) {
    const marginTop = element.y - (prevElement.y + prevElement.height);
    return {
      marginTop,
    };
  }
  const marginLeft = element.x - (prevElement.x + prevElement.width);
  return {
    marginLeft,
  };
};

export const computeGroupRowStyle = (
  groupNode: GroupNode,
  prevElement: TreeNode | null
): CSSProperties => {
  // compute flex direction
  const flexDirection = groupNode.rows.length === 1 ? "row" : "column";
  console.log(prevElement, "prevElement");
  console.log(groupNode, "groupNode");
  const margins = computeMarginsForElement(groupNode, prevElement, true);
  const groupRowStyle: CSSProperties = {
    display: "flex",
    flexDirection,
    width: groupNode.width,
    height: groupNode.height,
    marginLeft: margins.marginLeft,
    marginTop: margins.marginTop,
  };
  return groupRowStyle;
};

/**
 *
 * @param node - The node to compute the bounding box for.
 * @returns The bounding box of the node.
 */
export const computeGroupNodeBoundingBox = (node: GroupNode) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const child of node.children) {
    if (child.type === "group") {
      const boundingBox = computeGroupNodeBoundingBox(child);
      minX = Math.min(minX, boundingBox.minX);
      minY = Math.min(minY, boundingBox.minY);
      maxX = Math.max(maxX, boundingBox.maxX);
      maxY = Math.max(maxY, boundingBox.maxY);
    } else {
      minX = Math.min(minX, child.x);
      minY = Math.min(minY, child.y);
      maxX = Math.max(maxX, child.x + child.width);
      maxY = Math.max(maxY, child.y + child.height);
    }
  }

  return { minX, minY, maxX, maxY };
};

export const computeFrameNodeBoundingBox = (
  frame: NonDeletedExcalidrawElement,
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const frameElements = elements.filter(
    (element) => element.frameId === frame.id
  );
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of frameElements) {
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x + element.width);
    maxY = Math.max(maxY, element.y + element.height);
  }

  return { minX, minY, maxX, maxY };
};

export const computeFramePadding = (
  frame: NonDeletedExcalidrawElement,
  elements: readonly NonDeletedExcalidrawElement[]
): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} => {
  // Compute the minX, minY, maxX, maxY of the frame children
  const boundingBox = computeFrameNodeBoundingBox(frame, elements);
  return {
    left: boundingBox.minX - frame.x,
    top: boundingBox.minY - frame.y,
    right: frame.x + frame.width - boundingBox.maxX,
    bottom: frame.y + frame.height - boundingBox.maxY,
  };
};
