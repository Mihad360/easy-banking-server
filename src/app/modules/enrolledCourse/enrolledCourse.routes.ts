import express from "express";
import { endrolledCourseValidations } from "./enrolledCourse.validation";
import validateRequest from "../../middlewares/validateRequest";
import { endrolledCourseControllers } from "./enrolledCourse.controller";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  validateRequest(
    endrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  endrolledCourseControllers.createEnrolledCourse,
);
// router.get("/", endrolledCourseControllers.);
// router.get("/:id", endrolledCourseControllers.);
// router.delete("/:id", endrolledCourseControllers.);

export const enrolledCourseRoutes = router;
