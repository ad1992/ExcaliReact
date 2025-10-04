import { getElementsMap } from "../excalidraw-wrapper/utils";
import { excalidrawElementToHTML } from "./excalidrawElementToHTML";
import { useExcalidraw } from "../excalidraw-wrapper/hooks";
import reactElementToJSXString from "react-element-to-jsx-string";
import { buildLayoutTree } from "./buildLayoutTree";
import {
  computeFrameElementStyle,
  computeGroupRowStyle,
  computeMarginLeftForElement,
  computeRowBoundingBox,
  splitIntoRows,
} from "./utils";
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

export const createRowJSX = (children: React.ReactNode, marginTop: number) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop }}>
      {children}
    </div>
  );
};

export const processRows = (
  rows: Array<RowItem>,
  elementsMap: ElementsMap,
  prevElement: TreeNode | null
): {
  jsxElements: React.ReactNode[];
  newLastProcessedElement: TreeNode | null;
} => {
  const jsxElements: React.ReactNode[] = [];
  let lastProcessedElement = prevElement;

  for (const [index, row] of rows.entries()) {
    // Row can have prev element only if row has multiple elements and its not the first element of the row
    const rowJSXElements: React.ReactNode[] = [];
    const isSingleElementRow = row.length === 1;
    lastProcessedElement = null;
    for (const [rowIndex, rowItem] of row.entries()) {
      const siblingElement = rowIndex === 0 ? null : row[rowIndex - 1];

      // Handle group node
      if (rowItem.type === "group") {
        const groupRowStyle = computeGroupRowStyle(
          rowItem,
          lastProcessedElement
        );
        const { jsxElements: groupRowJSXElements, newLastProcessedElement } =
          processRows(rowItem.rows, elementsMap, null);
        // Compute the margin left for the group row with respect to its sibling element in the same row
        const marginLeft = computeMarginLeftForElement(rowItem, siblingElement);
        groupRowStyle.marginLeft = marginLeft;

        const groupRowJSX = (
          <div key={rowItem.id} style={groupRowStyle} id={rowItem.id}>
            {groupRowJSXElements}
          </div>
        );
        // Push the group row JSX to the current row JSX elements
        rowJSXElements.push(groupRowJSX);
        lastProcessedElement = newLastProcessedElement;
        continue;
      } else {
        // For first element in the row, there is no sibling element since its the first element in the row
        const jsxElement = excalidrawElementToHTML(
          rowItem,
          elementsMap,
          siblingElement,
          isSingleElementRow
        );
        if (!jsxElement) {
          continue;
        }
        rowJSXElements.push(jsxElement);

        lastProcessedElement = rowItem;
      }
    }

    if (rowJSXElements.length > 0) {
      const prevRow = index === 0 ? null : rows[index - 1];
      const boundingBoxPrevRow = computeRowBoundingBox(prevRow);
      const boundingBoxCurrentRow = computeRowBoundingBox(row);
      const marginTop = boundingBoxCurrentRow.minY - boundingBoxPrevRow.maxY;
      // Create the parent row and append the child rows to it
      const parentRow = createRowJSX(rowJSXElements, marginTop);
      jsxElements.push(parentRow);
    }
  }
  return { jsxElements, newLastProcessedElement: lastProcessedElement };
};
