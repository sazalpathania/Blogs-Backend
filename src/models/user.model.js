import { model, Schema } from "mongoose";

const userSchema = Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: undefined },
    resetPasswordExpires: { type: Date, default: undefined },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
