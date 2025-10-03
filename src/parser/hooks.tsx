import { getElementsMap } from "../excalidraw-wrapper/utils";
import { excalidrawElementToHTML } from "./excalidrawElementToHTML";
import { useExcalidraw } from "../excalidraw-wrapper/hooks";
import reactElementToJSXString from "react-element-to-jsx-string";
import { buildLayoutTree, splitIntoRows } from "./buildLayoutTree";
import { computeFrameElementStyle, computeGroupRowStyle } from "./utils";
import type { ElementsMap } from "@excalidraw/excalidraw/element/types";
import type { RowItem, TreeNode } from "./types";

export const useExcalidrawElementsToJSX = () => {
  const { elements } = useExcalidraw();
  if (elements.length === 0) {
    return null;
  }
  const elementsMap = getElementsMap(elements);
  const layoutTree = buildLayoutTree(elements);
  const frameNode = Object.values(layoutTree)[0];

  if (frameNode.type !== "frame") {
    console.error("Frame not found");
    return null;
  }

  const frameStyle = computeFrameElementStyle(frameNode);

  const rows = splitIntoRows(frameNode.children);
  console.log("rows", rows);
  const { jsxElements } = processRows(rows, elementsMap, null);

  return <div style={frameStyle}>{jsxElements}</div>;
};

export const useExcalidrawToJSXString = () => {
  const jsx = useExcalidrawElementsToJSX();
  const jsxComp = reactElementToJSXString(<>{jsx}</>, {
    showFunctions: true,
    functionValue: (fn) => fn.toString(),
  });
  return `import React from 'react';
export const ExcalidrawToReact = () => {
  return ${jsxComp}
};
`;
};

export const createRowJSX = (children: React.ReactNode) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
  );
};

export const processRows = (
  rows: Array<RowItem>,
  elementsMap: ElementsMap,
  prevElement: TreeNode | null
): {
  jsxElements: React.ReactNode[];
  newPrevElement: TreeNode | null;
} => {
  const jsxElements: React.ReactNode[] = [];
  let currentPrevElement = prevElement;

  for (const row of rows) {
    let rowPrevElement = currentPrevElement;
    const rowJSXElements: React.ReactNode[] = [];

    const isNewRow = row.length === 1 ? true : false;

    for (const rowItem of row) {
      // Handle group node
      if (rowItem.type === "group") {
        const groupRowStyle = computeGroupRowStyle(rowItem, currentPrevElement);
        const { jsxElements: groupRowJSXElements, newPrevElement } =
          processRows(rowItem.rows, elementsMap, null);

        const groupRowJSX = (
          <div key={rowItem.id} style={groupRowStyle} id={rowItem.id}>
            {groupRowJSXElements}
          </div>
        );

        jsxElements.push(groupRowJSX);
        currentPrevElement = newPrevElement;
        continue;
      } else {
        const jsxElement = excalidrawElementToHTML(
          rowItem,
          elementsMap,
          rowPrevElement,
          isNewRow
        );
        if (!jsxElement) {
          continue;
        }
        rowJSXElements.push(jsxElement);
        rowPrevElement = rowItem;

        currentPrevElement = row[0];
      }
    }

    if (rowJSXElements.length > 0) {
      // Create the parent row and append the child rows to it
      const parentRow = createRowJSX(rowJSXElements);
      jsxElements.push(parentRow);
    }
  }
  return { jsxElements, newPrevElement: currentPrevElement };
};
