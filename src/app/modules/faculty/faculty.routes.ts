import express from "express";
import { facultyControllers } from "./faculty.controller";
import { facultyValidation } from "./faculty.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  facultyControllers.getFaculty,
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  facultyControllers.getEachFaculty,
);
router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  facultyControllers.deleteFaculty,
);
router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  // validateRequest(facultyValidation.),
  facultyControllers.updateEachFaculty,
);

export const facultyRoutes = router;
