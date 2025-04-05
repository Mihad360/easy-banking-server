import express from "express";
import { endrolledCourseValidations } from "./enrolledCourse.validation";
import validateRequest from "../../middlewares/validateRequest";
import { endrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth("student"),
  validateRequest(
    endrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  endrolledCourseControllers.createEnrolledCourse,
);
router.get("/", auth("admin"), endrolledCourseControllers.getEnrolledCourses);
router.get(
  "/:id",
  auth("admin"),
  endrolledCourseControllers.getEachEnrolledCourses,
);
router.patch(
  "/update-enrolled-course-marks",
  auth("faculty"),
  validateRequest(
    endrolledCourseValidations.updateEnrolledCourseValidationSchema,
  ),
  endrolledCourseControllers.updateEnrolledCourse,
);
// router.delete("/:id", endrolledCourseControllers.);

export const enrolledCourseRoutes = router;
