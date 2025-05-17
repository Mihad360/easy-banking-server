import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(userValidations.createUserValidation),
  userControllers.createUser,
);
router.get("/", userControllers.getUsers);

export const userRoutes = router;
