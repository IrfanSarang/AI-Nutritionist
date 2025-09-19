import moongoose from 'mongoose';

const MONGO_URI =
  'mongodb+srv://irfan:irfan@cluster0.k4jbyjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await moongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDb connection failed: ', err);
    process.exit(1);
  }
};

export default connectDB;
