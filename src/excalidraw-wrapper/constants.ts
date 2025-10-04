/** This file contains the constants which needs to be exported from the project */
export const VERTICAL_ALIGN = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
};

export const TEXT_ALIGN = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

export const CJK_HAND_DRAWN_FALLBACK_FONT = "Xiaolai";
export const WINDOWS_EMOJI_FALLBACK_FONT = "Segoe UI Emoji";
// Segoe UI Emoji fails to properly fallback for some glyphs: ∞, ∫, ≠
// so we need to have generic font fallback before it
export const SANS_SERIF_GENERIC_FONT = "sans-serif";
export const MONOSPACE_GENERIC_FONT = "monospace";

export const FONT_FAMILY_GENERIC_FALLBACKS = {
  [SANS_SERIF_GENERIC_FONT]: 998,
  [MONOSPACE_GENERIC_FONT]: 999,
};

export const FONT_FAMILY_FALLBACKS = {
  [CJK_HAND_DRAWN_FALLBACK_FONT]: 100,
  ...FONT_FAMILY_GENERIC_FALLBACKS,
  [WINDOWS_EMOJI_FALLBACK_FONT]: 1000,
};
