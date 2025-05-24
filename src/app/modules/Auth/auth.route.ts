import express from "express";
import { authControllers } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { loginValidations } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(loginValidations.loginValidation),
  authControllers.loginUser,
);
router.post("/refresh-token", authControllers.refreshToken);
// router.get("/", userControllers.getUsers);

export const authRoutes = router;
