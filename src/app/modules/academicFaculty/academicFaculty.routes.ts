import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { academicFacultyValidation } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = express.Router();

router.post(
  "/create-academic-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicFacultyValidation.academicFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);
router.get(
  "/get-academic-faculty",
  AcademicFacultyControllers.getAcademicFaculty,
);
router.get(
  "/get-academic-faculty/:id",
  AcademicFacultyControllers.getEachAcademicFaculty,
);
// router.patch(
//   "/update-academic-semester/:id",
//   validateRequest(
//     academicSemesterValidation.updateAcademicSemesterValidationSchema,
//   ),
//   AcademicSemesterControllers.updateEachAcademicSemester,
// );

export const AcademicFacultyRoutes = router;
