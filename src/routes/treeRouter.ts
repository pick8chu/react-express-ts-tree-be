import { Router, Request, Response } from 'express';
import { Node } from '../model/node';
import { addNewNode, deleteNode, nodeToTreeNode } from '../utils/treeUtils';

/**
 * Some of the functions involve asynchronous operations
 * such as making HTTP requests and accessing a Map data structure,
 * so they are marked as async.
 */

const treeMap: Map<string, Node[]> = new Map();

let root: Node = {
  id: 'root',
  name: 'CEO',
  parentId: null,
  height: 0,
  departmentName: 'Company',
  role: 'manager',
};

function changeRootNode(req: Request, res: Response) {
  root = req.body;
  res.send(root);
}

async function addNewNodeHandler(req: Request, res: Response) {
  const newNode = req.body;

  if (!newNode.parentId) {
    res.status(400);
    res.send('parent id is required');
    return;
  }

  addNewNode(newNode, treeMap);
  console.log('post success', treeMap.get(newNode.parentId));
  res.status(201);
  res.send(newNode);
}

function getEntireTree(req: Request, res: Response) {
  res.send(nodeToTreeNode(root, treeMap));
}

function getChildrenByParentId(req: Request, res: Response) {
  const parentId = req.params.parentId;
  res.send(treeMap.get(parentId));
}

async function changeParent(req: Request, res: Response) {
  const [targetNodeParentId, targetNodeId, toParentId] = req.body.data;
  const targetArray = treeMap.get(targetNodeParentId);
  const targetIdx = targetArray?.findIndex(node => node.id === targetNodeId);
  if (!targetArray || targetIdx === undefined || targetIdx === -1) {
    res.status(400);
    res.send('target node not found');
    return;
  }

  const newNode = { ...targetArray[targetIdx], parentId: toParentId };
  addNewNode(newNode, treeMap);
  targetArray?.splice(targetIdx, 1);
  console.log('parent successfully changed', treeMap.get(newNode.parentId));
  res.send(req.body.data);
}

async function deleteNodeHandler(req: Request, res: Response) {
  const nodeId = req.params.nodeId;
  const parentId = req.body.parentId;

  const isDeleted = deleteNode(nodeId, parentId, treeMap);
  if (!isDeleted) {
    console.log('delete fail');
    res.status(400);
    res.send('delete failed');
    return;
  }

  console.log('delete success');
  res.status(204);
  res.send();
}

export const treeRouter = Router();

treeRouter.put('/root', changeRootNode);
treeRouter.post('/', addNewNodeHandler);
treeRouter.get('/', getEntireTree);
treeRouter.get('/:parentId', getChildrenByParentId);
treeRouter.put('/', changeParent);
treeRouter.delete('/:nodeId', deleteNodeHandler);
