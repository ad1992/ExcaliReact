import type { ElementsMap } from "@excalidraw/excalidraw/element/types";
import {
  getBoundTextElement,
  getContainerElement,
} from "../excalidraw-wrapper/utils";
import {
  computeBoundTextElementStyle,
  computeContainerElementStyle,
  computeExcalidrawElementStyle,
  computeGroupRowStyle,
  computeMarginLeftForElement,
} from "./utils";
import type { GroupNode, TreeNode, UIElementType } from "./types";

/**
 * Convert an Excalidraw element to an HTML element.
 * @param element The Excalidraw element to convert.
 * @param elementsMap The elements map.
 * @returns The equivalent HTML element.
 */
export const excalidrawElementToHTML = (
  element: TreeNode,
  elementsMap: ElementsMap,
  prevElement: TreeNode | null,
  isSingleElementRow: boolean
): React.ReactNode => {
  // Don't process group nodes
  if (element.type === "group") {
    return null;
  }
  const boundTextElement = getBoundTextElement(element, elementsMap);
  const boundTextBaseStyle = boundTextElement
    ? computeBoundTextElementStyle(boundTextElement)
    : {};
  const baseStyle = boundTextElement
    ? computeContainerElementStyle(element)
    : computeExcalidrawElementStyle(element);

  // Compute the margin left for the element with respect to its sibling element in the same row

  const marginLeft = computeMarginLeftForElement(element, prevElement);
  baseStyle.marginLeft = marginLeft;

  // For new row display the element as a flex container
  if (isSingleElementRow) {
    baseStyle.display = "flex";
  }

  if (element.customData?.type) {
    const customType = element.customData?.type as UIElementType["type"];

    switch (customType) {
      case "button": {
        return (
          <button
            key={element.id}
            style={baseStyle}
            name={boundTextElement?.text}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              alert(`You clicked on ${event.currentTarget.name}`)
            }
          >
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </button>
        );
      }
      case "input":
        return <input key={element.id} style={baseStyle} id={element.id} />;
      case "link":
        if (element.type !== "text") return null;
        return (
          <a
            key={element.id}
            style={baseStyle}
            href={element.text}
            target="_blank"
          >
            {element.text}
          </a>
        );
    }
  } else {
    switch (element.type) {
      case "rectangle":
        return (
          <div key={element.id} style={baseStyle}>
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </div>
        );
      case "ellipse":
        return (
          <div key={element.id} style={baseStyle}>
            <span key={boundTextElement?.id} style={boundTextBaseStyle}>
              {boundTextElement?.text}
            </span>
          </div>
        );
      case "text": {
        const container = getContainerElement(element, elementsMap);
        if (container) {
          return null;
        }
        return (
          <span key={element.id} style={baseStyle}>
            {element.text}
          </span>
        );
      }
      default:
        return null;
    }
  }
};

export const createGroupRowJSX = (
  children: React.ReactNode,
  groupNode: GroupNode
): React.ReactNode => {
  const groupRowStyle = computeGroupRowStyle(groupNode);
  return <div style={groupRowStyle}>{children}</div>;
};
