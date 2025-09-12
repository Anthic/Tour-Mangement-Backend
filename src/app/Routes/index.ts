import { Router } from "express";
import { UserRouter } from "../modules/Users/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoute } from "../modules/Division/division.route";
import { TourRoutes } from "../modules/Tour/tour.route";

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
  {
    path: "/division",
    route: DivisionRoute,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
];
moduleRoutes.map((route) => {
  router.use(route.path, route.route);
});
