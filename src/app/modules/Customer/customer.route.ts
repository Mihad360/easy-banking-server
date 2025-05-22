import express from "express";
import { customerControllers } from "./customer.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";

const router = express.Router();

router.get("/", auth(USER_ROLE.admin), customerControllers.getCustomers);
router.get("/:id", customerControllers.getEachCustomer);
router.patch("/:id", customerControllers.updateCustomer);
router.delete("/:id", customerControllers.deleteCustomer);

export const customerRoutes = router;
