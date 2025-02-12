import express from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { academicSemesterValidation } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/create-academic-semester",
  validateRequest(academicSemesterValidation.academicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);
router.get(
  "/get-academic-semester",
  AcademicSemesterControllers.getAcademicSemester,
);
router.get(
  "/get-academic-semester/:id",
  AcademicSemesterControllers.getEachAcademicSemester,
);
router.patch(
  "/update-academic-semester/:id",
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateEachAcademicSemester,
);

export const AcademicSemesterRoutes = router;
