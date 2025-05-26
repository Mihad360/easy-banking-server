import express from "express";
import { branchControllers } from "./branch.controller";
import validateRequest from "../../middlewares/validateRequest";
import { branchValidations } from "./branch.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";

const router = express.Router();

router.post(
  "/create-branch",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(branchValidations.createBranchValidation),
  branchControllers.createBranch,
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  branchControllers.getBranches,
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  branchControllers.getEachBranch,
);
router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(branchValidations.updateBranchValidation),
  branchControllers.updateBranch,
);

export const branchRoutes = router;
