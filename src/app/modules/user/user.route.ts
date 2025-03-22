import express from "express";
import { UserControllers } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidation } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createUser,
);
router.post(
  "/create-faculty",
  validateRequest(facultyValidation.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.get("/users");
router.delete("/:userId");
router.get("/:userId");

export const UserRoutes = router;
