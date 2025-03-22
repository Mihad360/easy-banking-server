import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";
import { adminControllers } from "./admin.controller";

const router = express.Router();


router.get("/", adminControllers.getAdmin);
router.get("/:id", adminControllers.getEachAdmin);
router.delete("/:id", adminControllers.deleteAdmin);
router.patch(
  "/:id",
  validateRequest(AdminValidations.updateAdminValidationSchema),
  adminControllers.updateEachAdmin,
);

export const adminRoutes = router;
