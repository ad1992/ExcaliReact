import type {
  ExcalidrawFrameElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import type { UIElement } from "../types";

export interface UIElementType {
  type: "rectangle" | "ellipse" | "text" | UIElement;
}

export interface FrameNode extends ExcalidrawFrameElement {
  type: "frame";
  children: (GroupNode | NonDeletedExcalidrawElement)[];
  padding: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export interface GroupNode {
  id: string;
  type: "group";
  children: TreeNode[];
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  rows: Array<RowItem>;
}

export type TreeNodeElement = NonDeletedExcalidrawElement & {
  type: NonDeletedExcalidrawElement["type"];
  children?: TreeNode[];
  padding?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
};

export type TreeNode = TreeNodeElement | GroupNode;

export type RowItem = Array<TreeNode | GroupNode>;
