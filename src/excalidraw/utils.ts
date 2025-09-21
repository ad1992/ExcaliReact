/** This file contains the utility functions which needs to be exported from the project */

import { FONT_FAMILY, ROUNDNESS } from "@excalidraw/excalidraw";
import type { FONT_FAMILY_FALLBACKS } from "@excalidraw/excalidraw/common/constants";
import type {
  ElementsMap,
  ExcalidrawElement,
  ExcalidrawTextElementWithContainer,
  FontFamilyValues,
  FontString,
} from "@excalidraw/excalidraw/element/types";
import {
  CJK_HAND_DRAWN_FALLBACK_FONT,
  FONT_FAMILY_GENERIC_FALLBACKS,
  MONOSPACE_GENERIC_FONT,
  SANS_SERIF_GENERIC_FONT,
  WINDOWS_EMOJI_FALLBACK_FONT,
} from "./constants";

const DEFAULT_PROPORTIONAL_RADIUS = 0.25;
const DEFAULT_ADAPTIVE_RADIUS = 32;

export const getCornerRadius = (x: number, element: ExcalidrawElement) => {
  if (
    element.roundness?.type === ROUNDNESS.PROPORTIONAL_RADIUS ||
    element.roundness?.type === ROUNDNESS.LEGACY
  ) {
    return x * DEFAULT_PROPORTIONAL_RADIUS;
  }

  if (element.roundness?.type === ROUNDNESS.ADAPTIVE_RADIUS) {
    const fixedRadiusSize = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;

    const CUTOFF_SIZE = fixedRadiusSize / DEFAULT_PROPORTIONAL_RADIUS;

    if (x <= CUTOFF_SIZE) {
      return x * DEFAULT_PROPORTIONAL_RADIUS;
    }

    return fixedRadiusSize;
  }

  return 0;
};

export const getBoundTextElementId = (container: ExcalidrawElement | null) => {
  return container?.boundElements?.length
    ? container?.boundElements?.find((ele) => ele.type === "text")?.id || null
    : null;
};

export const getBoundTextElement = (
  element: ExcalidrawElement | null,
  elementsMap: ElementsMap
) => {
  if (!element) {
    return null;
  }
  const boundTextElementId = getBoundTextElementId(element);

  if (boundTextElementId) {
    return (elementsMap.get(boundTextElementId) ||
      null) as ExcalidrawTextElementWithContainer | null;
  }
  return null;
};

export function getGenericFontFamilyFallback(
  fontFamily: number
): keyof typeof FONT_FAMILY_GENERIC_FALLBACKS {
  switch (fontFamily) {
    case FONT_FAMILY.Cascadia:
    case FONT_FAMILY["Comic Shanns"]:
      return MONOSPACE_GENERIC_FONT;

    default:
      return SANS_SERIF_GENERIC_FONT;
  }
}

export const getFontFamilyFallbacks = (
  fontFamily: number
): Array<keyof typeof FONT_FAMILY_FALLBACKS> => {
  const genericFallbackFont = getGenericFontFamilyFallback(fontFamily);

  switch (fontFamily) {
    case FONT_FAMILY.Excalifont:
      return [
        CJK_HAND_DRAWN_FALLBACK_FONT,
        genericFallbackFont,
        WINDOWS_EMOJI_FALLBACK_FONT,
      ];
    default:
      return [genericFallbackFont, WINDOWS_EMOJI_FALLBACK_FONT];
  }
};

export const getFontFamilyString = ({
  fontFamily,
}: {
  fontFamily: FontFamilyValues;
}) => {
  for (const [fontFamilyString, id] of Object.entries(FONT_FAMILY)) {
    if (id === fontFamily) {
      return `${fontFamilyString}${getFontFamilyFallbacks(id)
        .map((x) => `, ${x}`)
        .join("")}`;
    }
  }
  return WINDOWS_EMOJI_FALLBACK_FONT;
};

/** returns fontSize+fontFamily string for assignment to DOM elements */
export const getFontString = ({
  fontSize,
  fontFamily,
}: {
  fontSize: number;
  fontFamily: FontFamilyValues;
}) => {
  return `${fontSize}px ${getFontFamilyString({ fontFamily })}` as FontString;
};
