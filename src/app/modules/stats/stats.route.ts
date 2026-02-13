import { Router } from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../Users/user.interface";

const router = Router();

// Protected: ADMIN and SUPER_ADMIN only
router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.getDashboardStats
);

export const StatsRoutes = router;
