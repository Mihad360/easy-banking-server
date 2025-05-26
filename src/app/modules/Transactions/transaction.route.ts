import express from "express";
import { transactionControllers } from "./transaction.controller";

const router = express.Router();

router.post("/create-transaction", transactionControllers.createTransaction);
// router.get("/:id", transactionControllers);
// router.patch("/:id", transactionControllers);

export const transactionRoutes = router;
