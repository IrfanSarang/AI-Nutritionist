import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Reusing existing MongoDB connection");
    return;
  }

  if (!process.env.MONGO_URL) throw new Error("MongoDB url is not defined");

  await mongoose.connect(process.env.MONGO_URL
    , {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  isConnected = true;
  console.log("MongoDB connected successfully");
};

export default connectDB;
