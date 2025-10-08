import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import connectDB from './config/db';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

//Routes
app.use('/api/users', userRoutes);

//start server
// Choose port dynamically
const PORT = process.env.PORT || 5000; // Render sets process.env.PORT automatically

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
