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
router.post("/forget-password", authControllers.forgetPassword);
router.get("/reset-password", authControllers.resetPassword);

export const authRoutes = router;
