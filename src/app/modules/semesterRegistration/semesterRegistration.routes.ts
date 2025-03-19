import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { semesterValidations } from "./semesterRegistration.validation";
import { semesterRegistrationControllers } from "./semesterRegistration.controller";

const router = express.Router();

router.post(
  "/create-semester-registration",
  validateRequest(semesterValidations.SemesterRegistrationValidationSchema),
  semesterRegistrationControllers.createSemesterRegistration,
);
router.get("/", semesterRegistrationControllers.getSemesterRegistration);
router.get("/:id", semesterRegistrationControllers.getEachSemesterRegistration);
router.delete(
  "/:id",
  semesterRegistrationControllers.deleteSemesterRegistration,
);
router.patch(
  "/:id",
  validateRequest(
    semesterValidations.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);

export const semesterRegistrationRoutes = router;
