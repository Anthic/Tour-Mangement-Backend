import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { UserRole } from "../Users/user.interface";

import { upload } from "../../middlewares/upload";
import { validateFormData } from "../../middlewares/zodValidateFormData";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.zodvalidation";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("thumbnail"),
  validateFormData(createDivisionSchema),
  divisionController.createDivision
);

router.get("/", divisionController.getAllTheDivision);

router.get("/:slug", divisionController.getDivisionBySlug);
router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("thumbnail"),
  validateFormData(updateDivisionSchema),
  divisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  divisionController.deleteDivision
);
export const DivisionRoute = router;
