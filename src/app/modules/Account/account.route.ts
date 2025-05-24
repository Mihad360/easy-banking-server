import express from "express";
import { accountControllers } from "./account.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interface/global";

const router = express.Router();

router.post("/create-account",auth(USER_ROLE.customer), accountControllers.createAccount);
router.get("/", accountControllers.getAccounts);
// router.get("/", userControllers.getUsers);

export const accountRoutes = router;
