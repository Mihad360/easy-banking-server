import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { customerRoutes } from "../modules/Customer/customer.route";
import { accountRoutes } from "../modules/Account/account.route";
import { branchRoutes } from "../modules/Branches/branch.route";
import { managerRoutes } from "../modules/Manager/manager.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { transactionRoutes } from "../modules/Transactions/transaction.route";
import { loanRoutes } from "../modules/Loan/loan.route";
import { paymentRoutes } from "../modules/Payment/payment.route";

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
    path: "/customers",
    route: customerRoutes,
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
    path: "/manager",
    route: managerRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
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
    path: "/payment",
    route: paymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/students", StudentRoutes);
// router.use("/users", UserRoutes);

export default router;
