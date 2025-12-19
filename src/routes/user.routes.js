import { Router } from "express";
import {
  addLoginController,
  addRegisterController,
  getUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/login", addLoginController);
userRouter.post("/register", addRegisterController);

userRouter.get("/getUser", verifyToken, getUser)

export default userRouter;
