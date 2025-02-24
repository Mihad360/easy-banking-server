import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { academicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";

const router = express.Router();

router.post(
  "/create-academic-department",
  // validateRequest(
  //   academicDepartmentValidation.academicDepartmentValidationSchema,
  // ),
  AcademicDepartmentControllers.createAcademicDepartment,
);
router.get(
  "/get-academic-department",
  AcademicDepartmentControllers.getAcademicDepartment,
);
router.get(
  "/get-academic-department/:id",
  AcademicDepartmentControllers.getEachAcademicDepartment,
);
router.patch(
  "/update-academic-department/:id",
  validateRequest(
    academicDepartmentValidation.updateacademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateEachAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
