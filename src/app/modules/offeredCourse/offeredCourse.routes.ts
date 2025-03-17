import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { offeredCourseValidations } from "./offeredCourse.validation";
import { offeredCourseControllers } from "./offeredCourse.controller";

const router = express.Router();

router.post(
  "/create-offered-course",
  validateRequest(offeredCourseValidations.offeredCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);
router.get("/", offeredCourseControllers.getOfferedCourse);
// router.get("/:id", offeredCourseControllers);
// // router.delete("/:id", semesterRegistrationControllers.deleteEachStudentId);
// router.patch(
//   "/:id",
//   validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
//   offeredCourseControllers,
// );

export const offeredCourseRoutes = router;
