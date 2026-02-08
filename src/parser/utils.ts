import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { getCornerRadius, getFontString } from "../excalidraw-wrapper/utils";
import type { CSSProperties } from "react";
import { VERTICAL_ALIGN } from "../excalidraw-wrapper/constants";
import { FONT_FAMILY } from "@excalidraw/excalidraw";
import type { GroupNode, RowItem, TreeNode, TreeNodeElement } from "./types";
import { ROW_THRESHOLD_GAP } from "../constants";
import prettier from "prettier/standalone";
import babelParser from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
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
    border: `${element.strokeWidth}px ${element.strokeStyle} ${element.strokeColor}`,
    opacity: `${element.opacity / 100}`,
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
export const createStyleString = (style: CSSProperties): string => {
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
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };
};

export const normalizeFrameElement = (element: TreeNodeElement) => {
  return {
    ...element,
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };
};

export const computeGroupRowStyle = (groupNode: GroupNode): CSSProperties => {
  // compute flex direction
  const flexDirection = groupNode.rows.length === 1 ? "row" : "column";
  const groupRowStyle: CSSProperties = {
    display: "flex",
    flexDirection,
    width: groupNode.width,
    height: groupNode.height,
    marginLeft: groupNode.x,
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

export const computeRowBoundingBox = (row: RowItem | null) => {
  if (!row) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of row) {
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x + element.width);
    maxY = Math.max(maxY, element.y + element.height);
  }
  return { minX, minY, maxX, maxY };
};

/**
 * Compute the padding for a frame. The padding is computed based on the bounding box of the frame children.
 * @param frame - The frame to compute the padding for.
 * @param elements - The elements to compute the padding for.
 * @returns The padding for the frame.
 */
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
    left: roundOffToDecimals(boundingBox.minX - frame.x),
    top: roundOffToDecimals(boundingBox.minY - frame.y),
    right: roundOffToDecimals(frame.x + frame.width - boundingBox.maxX),
    bottom: roundOffToDecimals(frame.y + frame.height - boundingBox.maxY),
  };
};

export const areInSameRow = (node1: TreeNode, node2: TreeNode) => {
  const node1Top = node1.y;
  const node1Bottom = node1.y + node1.height;
  const node2Top = node2.y;
  const node2Bottom = node2.y + node2.height;

  const overlap =
    Math.min(node1Bottom, node2Bottom) - Math.max(node1Top, node2Top);

  return overlap > ROW_THRESHOLD_GAP;
};

export const splitIntoRows = (nodes: TreeNode["children"]): Array<RowItem> => {
  if (!nodes || nodes.length === 0) {
    return [];
  }
  const result: Array<RowItem> = [];
  const firstChild = nodes[0];
  // If the first child is a group, return the rows
  if (firstChild.type === "group") {
    const groupNodeRows = splitIntoRows(firstChild.children);

    result.push([
      {
        ...firstChild,
        rows: groupNodeRows,
      },
    ]);
    return result;
  }

  let currentRow: TreeNode["children"] = [firstChild];
  let previousElement: TreeNode = firstChild;

  for (let i = 1; i < nodes.length; i++) {
    const child = nodes[i];
    // Don't process group nodes
    if (child.type === "group") {
      const groupNode = child;
      const groupNodeRowElement = splitIntoRows(groupNode.children);
      const groupNodeRow = {
        ...groupNode,
        rows: groupNodeRowElement,
      };

      if (areInSameRow(groupNodeRow, previousElement)) {
        currentRow.push(groupNodeRow);
      } else {
        result.push(currentRow);
        currentRow = [groupNodeRow];
      }
      previousElement = groupNodeRow;
      continue;
    }
    if (areInSameRow(child, previousElement)) {
      currentRow.push(child);
    } else {
      result.push(currentRow);
      currentRow = [child];
    }
    previousElement = child;
  }
  result.push(currentRow);
  return result;
};

/**
 * Compute the margin left for an element with respect to its sibling element in the same row.
 * @param element - The element to compute the margin left for.
 * @param siblingElement - The sibling element to compute the margin left for.
 * @returns The margin left for the element.
 */
export const computeMarginLeftForElement = (
  element: TreeNode,
  siblingElement: TreeNode | null
) => {
  if (siblingElement) {
    return roundOffToDecimals(
      element.x - (siblingElement.x + siblingElement.width)
    );
  }
  // For first element in the row, there is no sibling element since its the first element in the row hence return the x coordinate of the element as its coordinates are with respect to the parent element
  return roundOffToDecimals(element.x);
};

/**
 * Format the code using prettier.
 * @param code - The code to format
 * @returns The formatted code
 */
export const formatCode = async (code: string): Promise<string> => {
  try {
    const formattedCode = await prettier.format(code, {
      parser: "babel",
      plugins: [babelParser, parserEstree],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
      arrowParens: "always",
    });
    return formattedCode;
  } catch (error) {
    console.error("Prettier formatting failed", error);
    return code;
  }
};

/**
 * Round off the value to the given number of decimals. By default it rounds off to 2 decimals.
 * @param value - The value to round off to decimals
 * @param decimals - The number of decimals to round off to
 * @returns
 */
export const roundOffToDecimals = (value: number, decimals: number = 2) => {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
};
