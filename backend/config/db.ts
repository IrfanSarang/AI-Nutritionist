<<<<<<< HEAD
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
=======
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) throw new Error('MONGO_URL not defined');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed: ', err);
    process.exit(1);
  }
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
};

export default connectDB;
