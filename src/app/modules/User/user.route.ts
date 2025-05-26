import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerValidations } from "../Customer/customer.validation";
import { managerValidations } from "../Manager/manager.validation";
import { adminValidations } from "../Admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";

const router = express.Router();

router.post(
  "/create-customer",
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.customer),
  validateRequest(customerValidations.createCustomerValidation),
  userControllers.createCustomer,
);
router.post(
  "/create-manager",
  auth(USER_ROLE.admin),
  validateRequest(managerValidations.createManagerValidation),
  userControllers.createManager,
);
router.post(
  "/create-admin",
  auth(USER_ROLE.admin),
  validateRequest(adminValidations.createAdminValidation),
  userControllers.createAdmin,
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  userControllers.getUsers,
);

export const userRoutes = router;
