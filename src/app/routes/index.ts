import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { customerRoutes } from "../modules/Customer/customer.route";
import { accountRoutes } from "../modules/Account/account.route";
import { branchRoutes } from "../modules/Branches/branch.route";
import { managerRoutes } from "../modules/Manager/manager.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/students", StudentRoutes);
// router.use("/users", UserRoutes);

export default router;
