import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../Users/user.interface";

import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.zodvalidation";
import { TourController, TourTypeController } from "./tour.controller";
import { uploadTourImages } from "../../middlewares/upload";
import { validateFormData } from "../../middlewares/zodValidateFormData";

const router = Router();

/**-------------TOUR ROUTE---------**/

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadTourImages,
  validateFormData(createTourZodSchema),
  TourController.createTour
);

router.get("/", TourController.getAllTours);

// ✅ Specific routes MUST come BEFORE wildcard routes
router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadTourImages,
  validateFormData(updateTourZodSchema),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourController.deletTour
);

/**--------------TOUR TYPES-------------------**/

router.post(
  "/create-tour-type",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateFormData(createTourTypeZodSchema),
  TourTypeController.createTourType
);

router.get("/tour-types", TourTypeController.getTourType);

router.patch(
  "/tour-types/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateFormData(updateTourTypeZodSchema),
  TourTypeController.updateTourType
);

router.delete(
  "/tour-types/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourTypeController.deletTourType
);

router.get("/:slug", TourController.getSingleTourSlug);

export const TourRoutes = router;
