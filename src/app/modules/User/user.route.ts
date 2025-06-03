import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerValidations } from "../Customer/customer.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-customer",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(customerValidations.createCustomerValidation),
  userControllers.createCustomer,
);
router.post("/verify-otp", userControllers.verifyOtp);
router.patch(
  "/update-role/:id",
  auth(USER_ROLE.admin),
  userControllers.updateUserRole,
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  userControllers.getUsers,
);
router.get(
  "/managers",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  userControllers.getManagers,
);
router.get("/admins", auth(USER_ROLE.admin), userControllers.getAdmins);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.manager),
  userControllers.getEachUsers,
);

export const userRoutes = router;
