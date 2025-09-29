import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export interface UIElementType {
  type: "rectangle" | "ellipse" | "text" | UIElement;
}

export interface GroupNode {
  id: string;
  type: "group";
  children: (GroupNode | NonDeletedExcalidrawElement)[];
  x: number;
  y: number;
  width: number;
  height: number;
}
