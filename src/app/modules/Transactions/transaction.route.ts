import express from "express";
import { transactionControllers } from "./transaction.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import validateRequest from "../../middlewares/validateRequest";
import { transactionValidations } from "./transaction.validation";

const router = express.Router();

router.post(
  "/create-deposit",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  validateRequest(transactionValidations.createTransactionSchema),
  transactionControllers.createDeposit,
);
router.post(
  "/create-withdraw",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  validateRequest(transactionValidations.createTransactionSchema),
  transactionControllers.createWithdraw,
);
router.post(
  "/create-transfer",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  validateRequest(transactionValidations.createTransactionSchema),
  transactionControllers.createTransfer,
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  transactionControllers.getTransactions,
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  transactionControllers.getEachTransactions,
);
router.get(
  "/personal-transactions",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  transactionControllers.getPersonalTransactions,
);

export const transactionRoutes = router;
