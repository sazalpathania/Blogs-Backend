import { config } from "dotenv";
config();

import mongoose from "mongoose";

const connectDB = async () => {
  console.log("check");
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((e) => {
      console.log("DB connection error", e);
    });
};

export default connectDB;
