import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/students", StudentRoutes);
// router.use("/users", UserRoutes);

export default router;
