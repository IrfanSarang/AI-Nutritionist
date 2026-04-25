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

import { generateRecipe } from "../controllers/recipeController";

import { protect } from "../middleware/auth";
import { aiLimiter, authLimiter } from "../middleware/rateLimiter";

import {
  fetchMeal,
  addMealItem,
  deleteMealItem,
  fetchProfile,
  addWeightLog,
} from "../controllers/planController";

const router = express.Router();

/* =====================================================
   AUTH ROUTES (PUBLIC)
===================================================== */
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/reset-password", authLimiter, resetPassword);

/* =====================================================
   PROFILE ROUTES (PROTECTED)
===================================================== */
router.post("/addProfile", protect, addProfile);
router.get("/:userId/profiles", protect, getProfiles);
router.delete("/:userId/profiles/:profileId", protect, deleteProfile);

router.get("/profile/:id", protect, getProfileById);
router.put("/profile/:id", protect, updateProfileById);

/* =====================================================
   IMPORTANT: STATIC ROUTES FIRST (AVOID PARAM CONFLICTS)
===================================================== */
router.get("/:userId/firstProfile", protect, fetchProfile);
router.get("/:profileId/fetchName", protect, fetchProfileName);

/* =====================================================
   MEAL ROUTES (PROTECTED)
===================================================== */
router.get("/:userId/:profileId/fetchMeal", protect, fetchMeal);

router.post("/:userId/profiles/:profileId/addMeal", protect, addMealItem);

router.delete(
  "/:userId/profiles/:profileId/deleteMeal",
  protect,
  deleteMealItem,
);

/* =====================================================
   OTHER USER ACTIONS
===================================================== */
router.post("/change-password", protect, changePassword);

/* =====================================================
   AI ROUTES (RATE LIMITED + PROTECTED)
===================================================== */
router.post("/chat", protect, aiLimiter, chatWithAI);
router.post("/product", protect, aiLimiter, getProductAIInsight);
router.post("/diagnosis", protect, aiLimiter, getProfileAIDiagnosis);
router.post("/recipe", protect, aiLimiter, generateRecipe);

/* =====================================================
   WEIGHT LOG
===================================================== */
router.post("/:userId/:profileId/weightLog", protect, addWeightLog);

export default router;
