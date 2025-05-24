import express from "express";
import { branchControllers } from "./branch.controller";

const router = express.Router();

router.post("/create-branch", branchControllers.createBranch);
router.get("/", branchControllers.getBranches);
// router.get("/", userControllers.getUsers);

export const branchRoutes = router;
