import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadFileController } from "../controllers/test.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const testRouter = Router();

testRouter.post("/upload", verifyToken, upload, uploadFileController);

export default testRouter;
