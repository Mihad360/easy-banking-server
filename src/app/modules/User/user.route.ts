import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerValidations } from "../Customer/customer.validation";
import { managerValidations } from "../Manager/manager.validation";

const router = express.Router();

router.post(
  "/create-customer",
  validateRequest(customerValidations.createCustomerValidation),
  userControllers.createCustomer,
);
router.post(
  "/create-manager",
  validateRequest(managerValidations.createManagerValidation),
  userControllers.createManager,
);
router.get("/", userControllers.getUsers);

export const userRoutes = router;
