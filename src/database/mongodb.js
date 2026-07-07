import mongoose from "mongoose";
import { config } from "../config/runtime.config.js";

export const connectDB = async () => {

  try {

    await mongoose.connect(config.mongoUri);

    console.log("MongoDB Connected");

  } catch (error) {

    console.error("MongoDB Error:", error);

    process.exit(1);
  }
};