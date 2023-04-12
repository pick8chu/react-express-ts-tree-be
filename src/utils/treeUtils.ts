import { Node, TreeNode } from '../model/node';

// convert `node` to `TreeNode` using `map`
export const nodeToTreeNode = (node: Node, map: Map<string, Node[]>): TreeNode => {
  return { node, children: map.get(node.id)?.map(node => nodeToTreeNode(node, map)) };
};

// add `newNode` to `map`
export const addNewNode = (newNode: Node, map: Map<string, Node[]>) => {
  if (!newNode.parentId) return;
  const nodeList = map.get(newNode.parentId);
  nodeList ? nodeList.push(newNode) : map.set(newNode.parentId, [newNode]);
  console.log(nodeList ? 'added to existing list' : 'created a new list');
};

export const deleteNode = (nodeId: string, parentNodeId: string, map: Map<string, Node[]>): boolean => {
  const targetNodeChildArray = map.get(nodeId);

  // child nodes has to be deleted first or else return false
  if (targetNodeChildArray && !targetNodeChildArray.every(node => deleteNode(node.id, nodeId, map))) {
    return false;
  }

  // deleting the node
  const targetArray = map.get(parentNodeId);
  const targetIdx = targetArray?.findIndex(node => node.id === nodeId);
  if (!targetArray || targetIdx === undefined || targetIdx === -1) {
    return false;
  }

  targetArray.splice(targetIdx, 1);
  return true;
};
