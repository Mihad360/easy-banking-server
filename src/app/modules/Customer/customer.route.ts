import express from "express";
import { customerControllers } from "./customer.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import validateRequest from "../../middlewares/validateRequest";
import { customerValidations } from "./customer.validation";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  customerControllers.getCustomers,
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  customerControllers.getEachCustomer,
);
router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(customerValidations.updateCustomerValidation),
  customerControllers.updateCustomer,
);
router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  customerControllers.deleteCustomer,
);

export const customerRoutes = router;
