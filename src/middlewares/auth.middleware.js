import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return (
        res.status(401),
        json({
          message: "Token Missing",
        })
      );
    }
    const decrypted = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decrypted;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
};

export default verifyToken;
