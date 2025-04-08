import express from "express";
import { endrolledCourseValidations } from "./enrolledCourse.validation";
import validateRequest from "../../middlewares/validateRequest";
import { endrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth(USER_ROLE.student),
  validateRequest(
    endrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  endrolledCourseControllers.createEnrolledCourse,
);
router.get(
  "/",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  endrolledCourseControllers.getEnrolledCourses,
);
router.get(
  "/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  endrolledCourseControllers.getEachEnrolledCourses,
);
router.patch(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.faculty, USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    endrolledCourseValidations.updateEnrolledCourseValidationSchema,
  ),
  endrolledCourseControllers.updateEnrolledCourse,
);
// router.delete("/:id", endrolledCourseControllers.);

export const enrolledCourseRoutes = router;
