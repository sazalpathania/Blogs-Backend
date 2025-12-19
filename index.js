import express from "express";
import connectDB from "./src/configs/db.config.js";
import cors from "cors";
import path from "path";
import fs from "fs";
import userRouter from "./src/routes/user.routes.js";
import blogRouter from "./src/routes/blogs.routes.js";
import { fileURLToPath } from "url";
import testRouter from "./src/routes/test.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());
app.use("/public", express.static("public"));

app.use("/test", testRouter);
app.use("/auth", userRouter);
app.use("/blog", blogRouter);

await connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
