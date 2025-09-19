import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import connectDB from './config/db';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

//Routes
app.use('/api/users', userRoutes);

//start server
const PORT = 'https://ai-nutritionist-5jyf.onrender.com/';
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
