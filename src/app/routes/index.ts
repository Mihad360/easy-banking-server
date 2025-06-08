import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { accountRoutes } from "../modules/Account/account.route";
import { branchRoutes } from "../modules/Branches/branch.route";
import { transactionRoutes } from "../modules/Transactions/transaction.route";
import { loanRoutes } from "../modules/Loan/loan.route";
import { typeRoutes } from "../modules/AccountTypes/type.route";
import { statRoutes } from "../modules/Admin-Customer-Stats/stats.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/account",
    route: accountRoutes,
  },
  {
    path: "/branch",
    route: branchRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
  {
    path: "/loan",
    route: loanRoutes,
  },
  {
    path: "/type",
    route: typeRoutes,
  },
  {
    path: "/stats",
    route: statRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/students", StudentRoutes);
// router.use("/users", UserRoutes);

export default router;
