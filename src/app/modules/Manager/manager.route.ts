import express from "express";
import { managerControllers } from "./manager.controller";

const router = express.Router();

router.get("/", managerControllers.getManagers);
router.get("/:id", managerControllers.getEachManager);
router.patch("/:id", managerControllers.updateManager);

export const managerRoutes = router;
