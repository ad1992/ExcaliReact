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
  formatCode,
  splitIntoRows,
} from "./utils";
import type { ElementsMap } from "@excalidraw/excalidraw/element/types";
import type { RowItem } from "./types";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export const useExcalidrawElementsToJSX = () => {
  const { elements } = useExcalidraw();
  if (elements.length === 0) {
    return null;
  }
  const elementsMap = getElementsMap(elements);
  const layoutTree = buildLayoutTree(elements);
  const frameNode = Object.values(layoutTree)[0];

  if (!frameNode || frameNode.type !== "frame") {
    console.error("Frame not found");
    return null;
  }

  const frameStyle = computeFrameElementStyle(frameNode);

  const rows = splitIntoRows(frameNode.children);

  const jsxElements = processRows(rows, elementsMap);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={frameStyle}>{jsxElements}</div>
    </div>
  );
};

export const useExcalidrawToJSXString = () => {
  const jsx = useExcalidrawElementsToJSX();
  const jsxComp = reactElementToJSXString(jsx, {
    showFunctions: true,
    functionValue: (fn) => fn.toString(),
  });

  const [formattedCode, setFormattedCode] = useState<string>("");
  useEffect(() => {
    const rawCode = `export const ExcalidrawToReact = () => {
      return (
        ${jsxComp}
        );
      };
      `;
    formatCode(rawCode).then(setFormattedCode);
  }, [jsxComp]);

  return formattedCode;
};

export const createRowJSX = (children: React.ReactNode, marginTop: number) => {
  const rowId = nanoid();

  return (
    <div
      style={{ display: "flex", alignItems: "center", marginTop }}
      key={rowId}
    >
      {children}
    </div>
  );
};

export const processRows = (
  rows: Array<RowItem>,
  elementsMap: ElementsMap
): React.ReactNode[] => {
  const jsxElements: React.ReactNode[] = [];

  for (const [index, row] of rows.entries()) {
    // Row can have prev element only if row has multiple elements and its not the first element of the row
    const rowJSXElements: React.ReactNode[] = [];
    const isSingleElementRow = row.length === 1;

    for (const [rowIndex, rowItem] of row.entries()) {
      const siblingElement = rowIndex === 0 ? null : row[rowIndex - 1];

      // Handle group node
      if (rowItem.type === "group") {
        const groupRowStyle = computeGroupRowStyle(rowItem);
        const groupRowJSXElements = processRows(rowItem.rows, elementsMap);
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
  return jsxElements;
};
