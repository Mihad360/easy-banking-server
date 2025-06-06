import express from "express";
import { typeControllers } from "./type.controller";

const router = express.Router();

router.get("/", typeControllers.getTypes);
router.get("/:id", typeControllers.getEachTypes);
router.patch("/:id", typeControllers.updateType);

export const typeRoutes = router;
