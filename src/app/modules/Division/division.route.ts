import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { UserRole } from "../Users/user.interface";
import { validationUser } from "../../middlewares/zodValidate";
import { createDivisionZodSchema } from "./division.zodvalidation";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationUser(createDivisionZodSchema),
  divisionController.createDivision
);

router.get("/", divisionController.getAllTheDivision);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  divisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  divisionController.deleteDivision
);
export const DivisionRoute = router;
