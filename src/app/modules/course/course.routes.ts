import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";

const router = express.Router();

router.post(
  "/create-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get("/", CourseControllers.getCourse);
router.get("/:id", CourseControllers.getEachCourse);
router.delete("/:id", CourseControllers.deleteCourse);
// router.patch(
//   "/:id",
//   //   validateRequest(createFacultyValidationSchema.updateStudentValidationSchema),
//   CourseControllers.updateEachFaculty,
// );

export const courseRoutes = router;
