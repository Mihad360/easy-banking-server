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
router.get("/:id", offeredCourseControllers.getEachOfferedCourse);
router.delete("/:id", offeredCourseControllers.deleteOfferedCourse);
router.patch(
  "/:id",
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

export const offeredCourseRoutes = router;
