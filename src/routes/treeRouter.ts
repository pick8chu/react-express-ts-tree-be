import { Router } from 'express';
import { Node, TreeNode } from '../model/node';

export const treeRouter = Router();

const treeMap: Map<string, Node[]> = new Map();

const root: Node = {
  id: 'root',
  name: 'CEO',
  parentId: null,
  height: 0,
  departmentName: 'Company',
  role: 'manager',
};

treeMap.set(root.id, [
  {
    id: '1',
    name: 'john',
    parentId: root.id,
    height: 1,
    departmentName: 'Management',
    role: 'manager',
  },
  {
    id: '2',
    name: 'jane',
    parentId: root.id,
    height: 1,
    departmentName: 'Tech',
    role: 'manager',
  },
]);
treeMap.set('1', [
  {
    id: '9',
    name: 'amy',
    parentId: '1',
    height: 2,
    programmingLanguage: 'java',
    role: 'employee',
  },
]);
treeMap.set('9', [
  {
    id: '8',
    name: 'harry',
    parentId: '9',
    height: 3,
    departmentName: 'HR',
    role: 'manager',
  },
]);

treeRouter.post('/', (req, res) => {
  const newNode = req.body;
  addNewNode(newNode);
  console.log('post success', treeMap.get(newNode.parentId));
  res.send(newNode);
});

treeRouter.get('/', (_, res) => {
  res.send([nodeToTreeNode(root, treeMap)]);
});

treeRouter.get('/:parentId', (req, res) => {
  const parentId = req.params.parentId;
  res.send(treeMap.get(parentId));
});

treeRouter.put('/', (req, res) => {
  const [targetNodeParentId, targetNodeId, toParentId] = req.body.data;
  const targetArray = treeMap.get(targetNodeParentId);
  const targetIdx = targetArray?.findIndex(node => node.id === targetNodeId);
  if (!targetArray || !targetIdx || targetIdx === -1) {
    res.status(400);
    res.send('target node not found');
    return;
  }

  const newNode = { ...targetArray[targetIdx], parentId: toParentId };
  addNewNode(newNode);
  targetArray?.splice(targetIdx, 1);
  console.log('parent successfully changed', treeMap.get(newNode.parentId));
  res.send(req.body.data);
});

const nodeToTreeNode = (node: Node, map: Map<string, Node[]>): TreeNode => {
  return { node, children: map.get(node.id)?.map(node => nodeToTreeNode(node, map)) };
};

const addNewNode = (newNode: Node) => {
  if (!newNode.parentId) return;
  const nodeList = treeMap.get(newNode.parentId);
  nodeList ? nodeList.push(newNode) : treeMap.set(newNode.parentId, [newNode]);
  console.log(nodeList ? 'added to existing list' : 'created a new list');
};
