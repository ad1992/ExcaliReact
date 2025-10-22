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
  const { elements, excalidrawAPI } = useExcalidraw();
  const appState = excalidrawAPI?.getAppState();
  const selectedElements = elements.filter(el => !!appState?.selectedElementIds?.[el.id]);
  const FrameId = selectedElements?.[0]?.frameId;
  const selectedFrame = elements.find(
  el =>
    el.type === "frame" &&
    (el.id === FrameId || appState?.selectedElementIds?.[el.id])
);
  if (!selectedFrame) {
    return {
      jsx: null,
      error: "Please select an Element or frame to convert to JSX",
    };
  }
  const selectedFrameElements = elements.filter(
  (el) => el.frameId === selectedFrame?.id
    );
  selectedFrameElements.push(selectedFrame!);
  try {
    const elementsMap = getElementsMap(selectedFrameElements);
    const layoutTree = buildLayoutTree(selectedFrameElements);
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
        <div id={`frame-${frameNode.id}`} style={frameStyle}>
          {jsxElements}
        </div>
      ),
      error: null,
    };
  } catch (error) {
    return {
      jsx: null,
      error: error instanceof Error ? `useExcalidrawElementsToJSX: ${error.message}` : "Unknown error",
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
    if (rows.length === 1) {
      jsxElements.push(rowJSXElements);
    } else if (rowJSXElements.length > 0) {
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
