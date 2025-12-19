import User from "../models/user.model.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

const addRegisterController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const addLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.status(201).json({
      message: "Login Successfull",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({
      message: "User data fetched",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/*const forgotPassController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const resetTokenPlain = crypto.randomBytes(32).toString("hex");

    const resetTokenHashed = crypto
      .createHash("sha256")
      .update(resetTokenPlain)
      .digest("hex");

    user.resetPasswordToken = resetTokenHashed;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:5174/reset-password/${resetTokenPlain}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {},
    });
  } catch (error) {}
};*/

export { addLoginController, addRegisterController, getUser };
