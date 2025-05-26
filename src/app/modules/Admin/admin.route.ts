import express from "express";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", adminControllers.getAdmins);
router.get("/:id", adminControllers.getEachAdmin);
router.patch("/:id", adminControllers.updateAdmin);

export const adminRoutes = router;
