import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Reusing existing MongoDB connection");
    return;
  }

  if (!process.env.MONGODB_URI) throw new Error("MongoDB url is not defined");

  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  isConnected = true;
  console.log("MongoDB connected successfully");
};

export default connectDB;
