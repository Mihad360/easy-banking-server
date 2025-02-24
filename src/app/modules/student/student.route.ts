import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";

const router = express.Router();

// router.post("/create-student", StudentControllers.createStudent);
router.get("/", StudentControllers.getStudent);
router.get("/:id", StudentControllers.getEachStudentId);
router.delete("/:id", StudentControllers.deleteEachStudentId);
router.patch(
  "/:id",
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateEachStudent,
);

export const StudentRoutes = router;
