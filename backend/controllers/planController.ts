import { Request, Response } from "express";
import User, { IPlan } from "../models/user";
import { isValidObjectId } from "mongoose";

/* =========================
   VALIDATION HELPER
========================= */
const validateIds = (userId: string, profileId?: string) => {
  if (!isValidObjectId(userId)) {
    return "Invalid userId";
  }

  if (profileId && !isValidObjectId(profileId)) {
    return "Invalid profileId";
  }

  return null;
};

/* =========================
   FETCH MEAL
========================= */
export const fetchMeal = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;

  const error = validateIds(userId, profileId);
  if (error) return res.status(400).json({ message: error });

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.profile.find((p) => p._id.toString() === profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    return res.json({
      breakfast: profile.plan?.[0]?.breakfast || [],
      lunch: profile.plan?.[0]?.lunch || [],
      dinner: profile.plan?.[0]?.dinner || [],
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   ADD MEAL
========================= */
export const addMealItem = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  const { mealType, item } = req.body;

  const error = validateIds(userId, profileId);
  if (error) return res.status(400).json({ message: error });

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.profile.find((p) => p._id.toString() === profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (!profile.plan || profile.plan.length === 0) {
      profile.plan = [{ breakfast: [], lunch: [], dinner: [] }];
    }

    const plan = profile.plan[0] as IPlan;

    plan[mealType] = plan[mealType] || [];
    plan[mealType].push(item);

    await user.save();

    return res.status(201).json({
      message: "Item added",
      [mealType]: plan[mealType],
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   DELETE MEAL
========================= */
export const deleteMealItem = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  const { mealType, item } = req.body;

  const error = validateIds(userId, profileId);
  if (error) return res.status(400).json({ message: error });

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.profile.find((p) => p._id.toString() === profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const plan = profile.plan?.[0];

    if (!plan) {
      return res.status(400).json({ message: "No plan found" });
    }

    const index = plan[mealType].indexOf(item);

    if (index === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    plan[mealType].splice(index, 1);

    await user.save();

    return res.json({
      message: "Item deleted",
      [mealType]: plan[mealType],
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   ADD WEIGHT LOG
========================= */
export const addWeightLog = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  const { weight } = req.body;

  const error = validateIds(userId, profileId);
  if (error) return res.status(400).json({ message: error });

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.profile.find((p) => p._id.toString() === profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.weightLog.push({
      date: new Date(),
      weight,
    });

    await user.save();

    return res.status(201).json({
      message: "Weight logged",
      weightLog: profile.weightLog,
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
