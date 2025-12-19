import { Router } from "express";
import {
  addBlogController,
  deleteBlogController,
  editBlogController,
  geBlogsController,
  getMyblogsController,
} from "../controllers/blog.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const blogRouter = Router();

blogRouter.post("/add", verifyToken, upload, addBlogController);
blogRouter.get("/get", geBlogsController);
blogRouter.get("/myblog", verifyToken, getMyblogsController);
blogRouter.put("/edit/:id", verifyToken, editBlogController);
blogRouter.delete("/delete/:id", verifyToken, deleteBlogController);

export default blogRouter;
