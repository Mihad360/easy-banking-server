import express from "express";
import { UserControllers } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidation } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.const";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  // validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createUser,
);
router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  validateRequest(facultyValidation.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  "/create-admin",
  // auth(USER_ROLE.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.patch(
  "/change-status/:id",
  auth("admin"),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);
router.get("/me", auth("student", "faculty", "admin"), UserControllers.getMe);
router.get("/users");
router.delete("/:userId");
router.get("/:userId");

export const UserRoutes = router;
