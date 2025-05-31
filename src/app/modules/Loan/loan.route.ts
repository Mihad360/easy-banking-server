import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import { loanControllers } from "./loan.controller";

const router = express.Router();

router.post(
  "/request-loan",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  //   validateRequest(branchValidations.createBranchValidation),
  loanControllers.requestLoan,
);
export const loanRoutes = router;
