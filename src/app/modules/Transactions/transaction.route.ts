import express from "express";
import { transactionControllers } from "./transaction.controller";

const router = express.Router();

router.post("/create-deposit", transactionControllers.createDeposit);
// router.get("/:id", transactionControllers);
// router.patch("/:id", transactionControllers);

export const transactionRoutes = router;
