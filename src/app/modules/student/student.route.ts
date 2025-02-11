import express from "express";
import { StudentControllers } from "./student.controller";

const router = express.Router();

// router.post("/create-student", StudentControllers.createStudent);
router.get("/", StudentControllers.getStudent);
router.get("/:id", StudentControllers.getEachStudentId);
router.delete("/:id", StudentControllers.deleteEachStudentId);

export const StudentRoutes = router;
