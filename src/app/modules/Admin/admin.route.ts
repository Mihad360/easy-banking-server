import express from "express";
import { adminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", auth(USER_ROLE.admin), adminControllers.getAdmins);
router.get("/:id", auth(USER_ROLE.admin), adminControllers.getEachAdmin);
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(adminValidations.updateAdminValidation),
  adminControllers.updateAdmin,
);

export const adminRoutes = router;
