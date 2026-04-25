import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import userRoutes from "../routes/userRoutes";
import connectDB from "../config/db";
import { generalLimiter } from "../middleware/rateLimiter";

/* =========================
   🔐 ENV VALIDATION (CRITICAL FIX)
========================= */
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not set in environment variables");
}

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL not set in environment variables");
}

/* =========================
   APP SETUP
========================= */
const app = express();

/* =========================
   DB CONNECTION
========================= */
connectDB();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(generalLimiter);

/* =========================
   ROUTES
========================= */
app.use("/api/users", userRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
