import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

router.post("/login", authControllers.loginUser);
// router.get("/", userControllers.getUsers);

export const authRoutes = router;
