import { Request, Response } from "express";
import User from "../models/user";
import { isValidObjectId } from "mongoose";

/* =========================
   GET PROFILE BY ID
========================= */
export const getProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid profile ID" });
  }

  try {
    const user = await User.findOne({ "profile._id": id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = user.profile.find((p) => p._id.toString() === id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   UPDATE PROFILE BY ID
========================= */
export const updateProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid profile ID" });
  }

  const updates = req.body;

  try {
    const user = await User.findOne({ "profile._id": id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = user.profile.find((p) => p._id.toString() === id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile, updates);

    await user.save();

    return res.status(200).json(profile);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
