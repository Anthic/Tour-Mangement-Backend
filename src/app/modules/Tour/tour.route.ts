import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../Users/user.interface";
import { validationUser } from "../../middlewares/zodValidate";
import { createTourZodSchema } from "./tour.zodvalidation";
import { TourController } from "./tour.controller";

const router = Router();

/**-------------TOUR ROUTE---------**/

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationUser(createTourZodSchema),
  TourController.createTour
);
export const TourRoutes = router