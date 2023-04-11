import { Router } from "express";
import { Node } from "../model/node";

export const treeRouter = Router();

const tree:Node[] = [];

treeRouter.post("/", (req, res) => {
    tree.push(req.body.data);
    res.send('added');
});

treeRouter.get("/", (req, res) => {
    res.send(tree);
});

treeRouter.put("/", (req, res) => {
    const [targetNodeId, toParentId] = req.body.data;
    const targetIdx = tree.findIndex((node) => node.id === targetNodeId);
    if(targetIdx === -1) {
        res.status(400);
        res.send('target node not found');
        return;
    }
    
    tree[targetIdx].parentId = toParentId;
});