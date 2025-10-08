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
  roundOffToDecimals,
  splitIntoRows,
} from "./utils";
import type { ElementsMap } from "@excalidraw/excalidraw/element/types";
import type { RowItem } from "./types";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export const useExcalidrawElementsToJSX = () => {
  const { elements } = useExcalidraw();

  try {
    const elementsMap = getElementsMap(elements);
    const layoutTree = buildLayoutTree(elements);
    const frameNode = Object.values(layoutTree)[0];

    if (!frameNode || frameNode.type !== "frame") {
      throw new Error(
        "Frame not found. Please create a frame to contain your elements."
      );
    }

    const frameStyle = computeFrameElementStyle(frameNode);

    const rows = splitIntoRows(frameNode.children);

    const jsxElements = processRows(rows, elementsMap);

    return {
      jsx: (
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
      ),
      error: null,
    };
  } catch (error) {
    return {
      jsx: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const useExcalidrawToJSXString = () => {
  const { jsx, error } = useExcalidrawElementsToJSX();

  const [formattedCode, setFormattedCode] = useState<string>("");
  useEffect(() => {
    if (!jsx || error) {
      setFormattedCode("");
      return;
    }
    const jsxComp = reactElementToJSXString(jsx, {
      showFunctions: true,
      functionValue: (fn) => fn.toString(),
    });
    const rawCode = `export const ExcaliReactApp = () => {
      return (
        ${jsxComp}
        );
      };
      `;
    formatCode(rawCode).then(setFormattedCode);
  }, [error, jsx]);

  return { jsxString: formattedCode, error };
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
      const marginTop = roundOffToDecimals(
        boundingBoxCurrentRow.minY - boundingBoxPrevRow.maxY
      );
      // Create the parent row and append the child rows to it
      const parentRow = createRowJSX(rowJSXElements, marginTop);
      jsxElements.push(parentRow);
    }
  }
  return jsxElements;
};
