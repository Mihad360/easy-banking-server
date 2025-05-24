import express from "express";
import { accountControllers } from "./account.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import validateRequest from "../../middlewares/validateRequest";
import { accountValidations } from "./account.validation";

const router = express.Router();

router.post(
  "/create-account",
  auth(USER_ROLE.customer),
  validateRequest(accountValidations.createAccountValidation),
  accountControllers.createAccount,
);
router.get("/", accountControllers.getAccounts);
router.get("/:id", accountControllers.getEachAccount);
router.patch("/:id", accountControllers.updateAccount);
router.patch(
  "/update-status/:id",
  accountControllers.updateAccountStatusOrInterest,
);
router.delete("/:id", accountControllers.deleteAccount);

export const accountRoutes = router;
