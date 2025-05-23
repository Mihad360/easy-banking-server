import express from "express";
import { accountControllers } from "./account.controller";

const router = express.Router();

router.post("/create-account", accountControllers.createAccount);
router.get("/", accountControllers.getAccounts);
// router.get("/", userControllers.getUsers);

export const accountRoutes = router;
