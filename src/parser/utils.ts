import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { getCornerRadius, getFontString } from "../excalidraw/utils";
import type { CSSProperties } from "react";
import { VERTICAL_ALIGN } from "../excalidraw/constants";
import { FONT_FAMILY } from "@excalidraw/excalidraw";

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
 * // { width: 100, height: 100, backgroundColor: "red", border: "1px solid black", borderRadius: 0, position: "absolute", left: 0, top: 0 }
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
    position: "absolute",
    left: element.x,
    top: element.y,
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
          fontFamily: element.fontFamily ?? FONT_FAMILY.Arial,
        }),
        color: element.strokeColor ?? "black",
        textAlign: element.textAlign as CSSProperties["textAlign"],
        verticalAlign: element.verticalAlign ?? VERTICAL_ALIGN.TOP,
      };
    default:
      return baseStyle;
  }
  return baseStyle;
};
