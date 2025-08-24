import { Router } from "express";
import { UserRouter } from "../modules/Users/user.route";
export const router = Router();
const moduleRoutes = [
  {
    path: "/users",
    route: UserRouter,
  },
];
moduleRoutes.map((route) => {
  router.use(route.path, route.route);
});
