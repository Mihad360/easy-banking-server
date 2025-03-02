import express from "express";
import { facultyControllers } from "./faculty.controller";
import { facultyValidation } from "./faculty.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create-faculty",
  validateRequest(facultyValidation.createFacultyValidationSchema),
  facultyControllers.createFaculty,
);
router.get("/", facultyControllers.getFaculty);
router.get("/:id", facultyControllers.getEachFaculty);
router.delete("/:id", facultyControllers.deleteFaculty);
router.patch(
  "/:id",
  //   validateRequest(createFacultyValidationSchema.updateStudentValidationSchema),
  facultyControllers.updateEachFaculty,
);

export const facultyRoutes = router;
