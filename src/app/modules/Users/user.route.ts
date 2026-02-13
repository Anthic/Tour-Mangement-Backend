import { Router } from "express";
import { UserController } from "./user.controller";

import { createUserZodSchema } from "./user.zodvalidation";
import { validationUser } from "../../middlewares/zodValidate";

import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validationUser(createUserZodSchema),
  UserController.createUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  UserController.updateUser
);
router.get("/me", checkAuth(...Object.values(UserRole)), UserController.getMe);
router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getsingleUser
);
router.get(
  "/get-all-users",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getAllUser
);
export const UserRouter = router;
