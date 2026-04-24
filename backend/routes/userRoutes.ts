import express from "express";
import {
  registerUser,
  loginUser,
  addProfile,
  getProfiles,
  deleteProfile,
  changePassword,
} from "../controllers/userController";

import {
  getProfileById,
  updateProfileById,
} from "../controllers/profileFetchController";

import {
  fetchMeal,
  addMealItem,
  deleteMealItem,
  fetchProfile,
} from "../controllers/planController";

import { fetchProfileName } from "../controllers/nameController";
import { chatWithAI } from "../controllers/chatController";
import {
  getProductAIInsight,
  getProfileAIDiagnosis,
} from "../controllers/aiInsightsController";

import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/forgetPassController";

import { protect } from "../middleware/auth";
import { aiLimiter, authLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Auth - public + rate limited
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/reset-password", authLimiter, resetPassword);

// Profile management - protected
router.post("/addProfile", protect, addProfile);
router.get("/:userId/profiles", protect, getProfiles);
router.delete("/:userId/profiles/:profileId", protect, deleteProfile);
router.get("/profile/:id", protect, getProfileById);
router.put("/profile/:id", protect, updateProfileById);

// Meal plan - protected
router.get("/:userId/:profileId/fetchMeal", protect, fetchMeal);
router.post("/:userId/profiles/:profileId/addMeal", protect, addMealItem);
router.delete(
  "/:userId/profiles/:profileId/deleteMeal",
  protect,
  deleteMealItem,
);

// Profile helpers - protected
router.get("/:userId/firstProfile", protect, fetchProfile);
router.get("/:profileId/fetchName", protect, fetchProfileName);

// Change password (logged in user)
router.post("/change-password", protect, changePassword);

// AI services - protected + rate limited
router.post("/chat", protect, aiLimiter, chatWithAI);
router.post("/product", protect, aiLimiter, getProductAIInsight);
router.post("/diagnosis", protect, aiLimiter, getProfileAIDiagnosis);

export default router;
