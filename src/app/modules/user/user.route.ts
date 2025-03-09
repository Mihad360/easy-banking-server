import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidation } from "../faculty/faculty.validation";

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
router.get("/users");
router.delete("/:userId");
router.get("/:userId");

export const UserRoutes = router;
