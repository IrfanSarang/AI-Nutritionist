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
};

export default connectDB;
