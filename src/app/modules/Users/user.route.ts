import { Router } from "express";
import { UserController } from "./user.controller";

import { createUserZodSchema } from "./user.zodvalidation";
import { validationUser } from "../../middlewares/zodValidate";

import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();

router.post(
  "/register",
  validationUser(createUserZodSchema),
  UserController.createUser
);

router.get(
  "/get-all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  UserController.getAllUser
);
export const UserRouter = router;
