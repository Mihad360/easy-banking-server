import express from "express";
import { customerControllers } from "./customer.controller";

const router = express.Router();

router.get("/", customerControllers.getCustomers);
router.get("/:id", customerControllers.getEachCustomer);
router.patch("/:id", customerControllers.updateCustomer);
router.delete("/:id", customerControllers.deleteCustomer);

export const customerRoutes = router;
