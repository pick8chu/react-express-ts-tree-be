import { Router } from 'express';
import { Node } from '../model/node';
import { addNewNode, deleteNode, nodeToTreeNode } from '../utils/treeUtils';

export const treeRouter = Router();

const treeMap: Map<string, Node[]> = new Map();

// example root node
let root: Node = {
  id: 'root',
  name: 'CEO',
  parentId: null,
  height: 0,
  departmentName: 'Company',
  role: 'manager',
};

// change root node [v]
treeRouter.put(
  '/root',
  (
    req: {
      body: Node;
    },
    res,
  ) => {
    root = req.body;
    res.send(root);
  },
);

// add new node except root [v]
treeRouter.post(
  '/',
  (
    req: {
      body: Node;
    },
    res,
  ) => {
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
  },
);

// get entire tree [v]
treeRouter.get('/', (_, res) => {
  res.send([nodeToTreeNode(root, treeMap)]);
});

// get children according to parent id
treeRouter.get(
  '/:parentId',
  (
    req: {
      params: {
        parentId: string;
      };
    },
    res,
  ) => {
    const parentId = req.params.parentId;
    res.send(treeMap.get(parentId));
  },
);

// change parent
treeRouter.put(
  '/',
  (
    req: {
      body: {
        data: [string, string, string];
      };
    },
    res,
  ) => {
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
  },
);

// delete node [v]
treeRouter.delete(
  '/:nodeId',
  (
    req: {
      params: {
        nodeId: string;
      };
      body: {
        parentId: string;
      };
    },
    res,
  ) => {
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
  },
);
