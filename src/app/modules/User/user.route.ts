import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerValidations } from "../Customer/customer.validation";

const router = express.Router();

router.post(
  "/create-customer",
  validateRequest(customerValidations.createCustomerValidation),
  userControllers.createCustomer,
);
router.post(
  "/create-manager",
  // validateRequest(),
  userControllers.createManager,
);
router.get("/", userControllers.getUsers);

export const userRoutes = router;
