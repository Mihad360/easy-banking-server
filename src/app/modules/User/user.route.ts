import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerValidations } from "../Customer/customer.validation";
import { managerValidations } from "../Manager/manager.validation";
import { adminValidations } from "../Admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-customer",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateRequest(customerValidations.createCustomerValidation),
  userControllers.createCustomer,
);
router.post(
  "/create-manager",
  validateRequest(managerValidations.createManagerValidation),
  userControllers.createManager,
);
router.post(
  "/create-admin",
  validateRequest(adminValidations.createAdminValidation),
  userControllers.createAdmin,
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  userControllers.getUsers,
);

export const userRoutes = router;
