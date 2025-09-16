import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../Users/user.interface";
import { validationUser } from "../../middlewares/zodValidate";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.zodvalidation";
import { TourController, TourTypeController } from "./tour.controller";

const router = Router();

/**-------------TOUR ROUTE---------**/

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationUser(createTourZodSchema),
  TourController.createTour
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationUser(updateTourZodSchema),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourController.deletTour
);
router.get("/", TourController.getAllTours);

/**--------------TOUR TYPES-------------------**/

router.post(
  "/create-tour-type",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationUser(createTourTypeZodSchema),
  TourTypeController.createTourType
);

router.patch(
  "/tour-types/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationUser(updateTourTypeZodSchema),
  TourTypeController.updateTourType
);

router.delete(
  "/tour-types/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourTypeController.deletTourType
);

router.get("/tour-types", TourTypeController.getTourType);

export const TourRoutes = router;
