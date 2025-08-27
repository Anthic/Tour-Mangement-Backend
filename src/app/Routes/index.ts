import { Router } from "express";
import { UserRouter } from "../modules/Users/user.route";
import { AuthRoute } from "../modules/auth/auth.route";

export const router = Router();
const moduleRoutes = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
];
moduleRoutes.map((route) => {
  router.use(route.path, route.route);
});
