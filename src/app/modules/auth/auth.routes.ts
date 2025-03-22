import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);
// router.get("/", adminControllers);
// router.get("/:id", adminControllers);
// router.delete("/:id", adminControllers);
// router.patch(
//   "/:id",
//   validateRequest(AuthValidations.),
//   adminControllers,
// );

export const authRoutes = router;
