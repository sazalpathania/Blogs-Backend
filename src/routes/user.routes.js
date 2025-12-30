import { Router } from "express";
import {
  addLoginController,
  addRegisterController,
  forgotPassController,
  getUser,
  resetPasswordController,
} from "../controllers/user.controller.js";

import verifyToken from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/login", addLoginController);
userRouter.post("/register", addRegisterController);

userRouter.get("/getUser", verifyToken, getUser);

userRouter.post("/forgot-password", forgotPassController);
userRouter.post("/reset-password/:token", resetPasswordController);

export default userRouter;
