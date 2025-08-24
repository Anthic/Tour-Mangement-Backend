import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/get-all-users", UserController.getAllUser);
export const UserRouter = router;
