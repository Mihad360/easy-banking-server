import express from "express";
import { paymentControllers } from "./payment.controller";

const router = express.Router();

router.post("/create-payment", paymentControllers.createPayment);

export const paymentRoutes = router;