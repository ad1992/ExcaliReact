import type {
  ElementsMap,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import {
  computeFramePadding,
  computeGroupNodeBoundingBox,
  normalizeElement,
} from "./utils";
import type { GroupNode, RowItem, TreeNode } from "./types";
import {
  getBoundTextElement,
  getContainerElement,
  getElementsMap,
} from "../excalidraw-wrapper/utils";

const ROW_THRESHOLD_GAP = 10;
/**
 * Build the layout tree for the elements. The layout tree is a tree of nodes grouped by their groupIds in order of their nesting depth. The nodes are sorted based on their position in the DOM.
 * @param elements - The elements to build the layout tree for.
 * @returns The layout tree.
 */
export const buildLayoutTree = (
  elements: readonly NonDeletedExcalidrawElement[]
): Record<string, TreeNode> => {
  if (elements.length === 0) {
    return {};
  }

  const frame = elements.find((element) => element.type === "frame");
  if (!frame) {
    alert("Frame not found");
    return {};
  }

  const rootNodes: Record<string, TreeNode> = {};

  // Add the frame to the root nodes as frame is the parent of all the elements
  rootNodes[frame.id] = {
    ...frame,
    children: [],
    name: frame.name,
    padding: computeFramePadding(frame, elements),
  };
  const frameNode = rootNodes[frame.id];

  const groupMap: Record<string, GroupNode> = {};

  const getGroupNode = (groupId: string) => {
    if (groupMap[groupId]) {
      return groupMap[groupId];
    }
    const groupNode: TreeNode = {
      id: groupId,
      type: "group",
      children: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rows: [],
    };
    groupMap[groupId] = groupNode;
    return groupNode;
  };

  // Frame is necessary for the tree to be built as it is the parent of all the elements
  const frameElements = elements.filter(
    (element) => element.frameId === frame.id
  );

  if (!frameNode.children) {
    return {};
  }
  const elementsMap = getElementsMap(frameElements);

  for (const element of frameElements) {
    // If element is not part of any group, add it to the root nodes
    if (element.groupIds.length === 0) {
      // check if element has bound text
      const processedElement = processElement(element, elementsMap);
      if (processedElement) {
        frameNode.children.push(processedElement);
      }
      continue;
    } else {
      // Start from outermost group and add the element to the group node
      let parentGroup = getGroupNode(element.groupIds[0]);

      if (!frameNode.children.includes(parentGroup)) {
        frameNode.children.push(parentGroup);
      }

      for (let i = 1; i < element.groupIds.length; i++) {
        const groupId = element.groupIds[i];
        const groupNode = getGroupNode(groupId);
        if (!parentGroup.children.includes(groupNode)) {
          parentGroup.children.push(groupNode);
        }
        parentGroup = groupNode;
      }
      // Add the element to the innermost group
      if (!parentGroup.children.includes(element)) {
        const processedElement = processElement(element, elementsMap);
        if (processedElement) {
          parentGroup.children.push(processedElement);
        }
      }
    }
  }

  const groupNodes = frameNode.children.filter((node) => node.type === "group");
  // compute the bounding box of the group nodes and update the group node with the bounding box coordinates
  for (const node of groupNodes) {
    const boundingBox = computeGroupNodeBoundingBox(node);
    Object.assign(node, {
      x: boundingBox.minX,
      y: boundingBox.minY,
      width: boundingBox.maxX - boundingBox.minX,
      height: boundingBox.maxY - boundingBox.minY,
    });
  }

  // normalize the group nodes with respect to the parent node
  normalizeLayoutNodes(frameNode);

  // Sort the nodes based on the position so its placed in correct order
  // in the DOM
  sortNodesByPosition(frameNode);
  return rootNodes;
};

/**
 * Sort the nodes in the frame node based on the position so its placed in correct order
 * in the DOM
 * @param frameNode - The frame node to sort the nodes for.
 * @returns The sorted frame node.
 */
export const sortNodesByPosition = (node: TreeNode) => {
  if (!node.children) {
    return;
  }
  node.children.sort((a, b) => {
    if (Math.abs(a.y - b.y) < ROW_THRESHOLD_GAP) {
      return a.x - b.x; // same row → left-to-right
    }
    return a.y - b.y; // otherwise top-to-bottom
  });

  // Sort the children of the group nodes recursively
  node.children.forEach((child) => {
    if (child.type === "group") {
      sortNodesByPosition(child);
    }
  });
};

export const splitIntoRows = (nodes: TreeNode["children"]): Array<RowItem> => {
  if (!nodes || nodes.length === 0) {
    return [];
  }
  const result: Array<RowItem> = [];
  const firstChild = nodes[0];

  // If the first child is a group, return the rows
  if (firstChild.type === "group") {
    const groupNodeRows = splitIntoRows(firstChild.children);

    result.push([
      {
        ...firstChild,
        rows: groupNodeRows,
      },
    ]);
    return result;
  }

  let currentRow: TreeNode["children"] = [firstChild];

  for (let i = 1; i < nodes.length; i++) {
    const child = nodes[i];

    // Don't process group nodes
    if (child.type === "group") {
      const groupNode = child;
      const groupNodeRowElement = splitIntoRows(groupNode.children);
      const groupNodeRow = {
        ...groupNode,
        rows: groupNodeRowElement,
      };
      if (Math.abs(groupNode.y - currentRow[0].y) < ROW_THRESHOLD_GAP) {
        currentRow.push(groupNodeRow);
      } else {
        result.push(currentRow);
        currentRow = [groupNodeRow];
      }
      continue;
    }
    if (Math.abs(child.y - currentRow[0].y) < ROW_THRESHOLD_GAP) {
      currentRow.push(child);
    } else {
      result.push(currentRow);
      currentRow = [child];
    }
  }
  result.push(currentRow);
  return result;
};

/**
 * Process the element by adding the bound text element to the children of the element if it has one.
 * If the element is a text element and has a container, skip it since its already added to the container child of the text element.
 * @param element - The element to process.
 * @param elementsMap - The elements map.
 * @returns The processed element. Can be null if the element is a text element and has a container.
 *
 */
export const processElement = (
  element: NonDeletedExcalidrawElement,
  elementsMap: ElementsMap
) => {
  const boundTextElement = getBoundTextElement(element, elementsMap);
  const containerElement =
    element.type === "text" ? getContainerElement(element, elementsMap) : null;

  // If element is a text element and has a container, skip it since its already added to the container child of the text element
  if (containerElement) {
    return;
  }
  const normalizedElement = normalizeElement(element);
  // If element has a bound text element, add it to the children of the element
  if (boundTextElement) {
    return {
      ...normalizedElement,
      children: [normalizeElement(boundTextElement)],
    };
  }
  // If element has no bound text element, return the normalized element
  return normalizedElement;
};

export const normalizeLayoutNodes = (parentNode: TreeNode) => {
  if (!parentNode.children) {
    return [];
  }
  const parentNodePadding = parentNode.padding ?? {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  for (const [index, node] of parentNode.children.entries()) {
    const updatedNode = {
      ...node,
      x: node.x - parentNode.x - parentNodePadding.left,
      y: node.y - parentNode.y - parentNodePadding.top,
    };
    parentNode.children[index] = updatedNode;

    if (node.children?.length) {
      normalizeLayoutNodes(node);
    }
  }
};
