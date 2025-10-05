import { UIElement } from "./types";

export const ROW_THRESHOLD_GAP = 10;

export const DEFAULT_CONFIG = {
  BUTTON: {
    width: 165,
    height: 40,
    backgroundColor: "#4c6ef5",
    label: {
      text: "Sample Button",
      fontSize: 16,
      strokeColor: "#ffffff",
    },
    strokeWidth: 2,
    roughness: 1,
    strokeColor: "#4263eb",
    customData: {
      type: UIElement.BUTTON,
    },
  },
  LINK: {
    text: "Sample Link",
    fontSize: 16,
    strokeColor: "#4263eb",
    customData: {
      type: UIElement.LINK,
    },
  },
  INPUT: {
    fontSize: 16,
    width: 165,
    height: 40,
    backgroundColor: "#f1f3f5",
    strokeWidth: 1,
    customData: {
      type: UIElement.INPUT,
    },
  },
};
