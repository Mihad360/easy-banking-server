import express from "express";
import { managerControllers } from "./manager.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";
import validateRequest from "../../middlewares/validateRequest";
import { managerValidations } from "./manager.validation";

const router = express.Router();

router.get("/", managerControllers.getManagers);
router.get("/:id", auth(USER_ROLE.admin), managerControllers.getEachManager);
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(managerValidations.updateManagerValidation),
  managerControllers.updateManager,
);

export const managerRoutes = router;
