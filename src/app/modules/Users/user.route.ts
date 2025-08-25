/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z, { AnyZodObject } from "zod";
import { createUserZodSchema } from "./user.zodvalidation";
import { validationUser } from "../../middlewares/zodValidate";

const router = Router();

router.post("/register", validationUser(createUserZodSchema), UserController.createUser);

router.get("/get-all-users", UserController.getAllUser);
export const UserRouter = router;
