import User from "../models/user.model.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import sendEmail from "../utils/utils.sendEmail.js";

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
    console.log("error", error.message);
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
    const userId = req.user._id;
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

const forgotPassController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const resetTokenPlain = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetTokenHashed = crypto
      .createHash("sha256")
      .update(resetTokenPlain)
      .digest("hex");

    user.resetPasswordToken = resetTokenHashed;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetTokenPlain}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
          <h2>Password Reset Request</h2>
          <p>Click on the link below to reset your password</p>
          <a href = "${resetURL}" target= "_blank">${resetURL}</a>
          <p>If you didn't request this, please ignore this email</p>`,
    });
    console.log("Email sent to", user.email);
    return res.status(200).json({
      message: "Reset link generated ",
      resetURL,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= RESET PASSWORD =================
const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    let decoded;
    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addLoginController,
  addRegisterController,
  getUser,
  forgotPassController,
  resetPasswordController,
};
