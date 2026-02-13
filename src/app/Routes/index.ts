import { Router } from "express";
import { UserRouter } from "../modules/Users/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoute } from "../modules/Division/division.route";
import { TourRoutes } from "../modules/Tour/tour.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { StatsRoutes } from "../modules/stats/stats.route";

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
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },

];
moduleRoutes.map((route) => {
  router.use(route.path, route.route);
});
