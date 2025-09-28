import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export interface GroupNode {
  id: string;
  type: "group";
  children: (GroupNode | NonDeletedExcalidrawElement)[];
  x: number;
  y: number;
  width: number;
  height: number;
}
export const buildLayoutTree = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const rootNodes = [];

  const groupMap: Record<string, GroupNode> = {};

  const getGroupNode = (groupId: string) => {
    if (groupMap[groupId]) {
      return groupMap[groupId];
    }
    const groupNode: GroupNode = {
      id: groupId,
      type: "group",
      children: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    groupMap[groupId] = groupNode;
    return groupNode;
  };

  for (const element of elements) {
    // If element is not part of any group, add it to the root nodes
    if (element.groupIds.length === 0) {
      rootNodes.push(element);
      continue;
    } else {
      // Start from outermost group and add the element to the group node
      let parentGroup = getGroupNode(element.groupIds[0]);

      if (!rootNodes.includes(parentGroup)) {
        rootNodes.push(parentGroup);
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
        parentGroup.children.push(element);
      }
    }
  }

  // compute the bounding box of the group nodes
  for (const node of rootNodes) {
    if (node.type === "group") {
      const boundingBox = computeBoundingBox(node);
      node.x = boundingBox.minX;
      node.y = boundingBox.minY;
      node.width = boundingBox.maxX - boundingBox.minX;
      node.height = boundingBox.maxY - boundingBox.minY;

      for (const child of node.children) {
        if (child.type !== "group") {
          const updatedChild = {
            ...child,
            x: child.x - boundingBox.minX,
            y: child.y - boundingBox.minY,
          };
          const childIndex = node.children.indexOf(child);
          node.children[childIndex] = updatedChild;
        }
      }
    }
  }
  return rootNodes;
};

export const computeBoundingBox = (node: GroupNode) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const child of node.children) {
    if (child.type === "group") {
      const boundingBox = computeBoundingBox(child);
      minX = Math.min(minX, boundingBox.minX);
      minY = Math.min(minY, boundingBox.minY);
      maxX = Math.max(maxX, boundingBox.maxX);
      maxY = Math.max(maxY, boundingBox.maxY);
    } else {
      minX = Math.min(minX, child.x);
      minY = Math.min(minY, child.y);
      maxX = Math.max(maxX, child.x + child.width);
      maxY = Math.max(maxY, child.y + child.height);
    }
  }

  return { minX, minY, maxX, maxY };
};
