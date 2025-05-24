import express from "express";
import { branchControllers } from "./branch.controller";
import validateRequest from "../../middlewares/validateRequest";
import { branchValidations } from "./branch.validation";

const router = express.Router();

router.post(
  "/create-branch",
  validateRequest(branchValidations.createBranchValidation),
  branchControllers.createBranch,
);
router.get("/", branchControllers.getBranches);
// router.get("/", userControllers.getUsers);

export const branchRoutes = router;
