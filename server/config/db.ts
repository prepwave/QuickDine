import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;