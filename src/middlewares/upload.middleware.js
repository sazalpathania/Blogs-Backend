import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/"); // Files will be saved in the 'public/' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Unique file name
  },
});

// Configure multer for single file upload
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
}).single("file");
