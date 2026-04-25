import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "../routes/userRoutes";
import connectDB from "../config/db";
import { generalLimiter } from "../middleware/rateLimiter";

const app = express();

/* =========================
   DB CONNECTION
========================= */
connectDB();

/* =========================
   SECURITY HEADERS (NEW FIX)
========================= */
app.use(helmet()); // <-- MUST BE FIRST SECURITY LAYER

/* =========================
   CORS CONFIG (SAFE)
========================= */
const allowedOrigin = process.env.ALLOWED_ORIGIN;

if (!allowedOrigin && process.env.NODE_ENV === "production") {
  throw new Error(
    "ALLOWED_ORIGIN is not set in production environment. Aborting server.",
  );
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / Postman
      if (!origin) return callback(null, true);

      // dev mode = open
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // production strict check
      if (origin === allowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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
   GLOBAL ERROR HANDLER
========================= */
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS policy blocked this request",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
