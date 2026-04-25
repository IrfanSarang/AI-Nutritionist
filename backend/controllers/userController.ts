import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   PASSWORD VALIDATION
========================= */
const isStrongPassword = (password: string): boolean => {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include uppercase, number, and special character",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("REGISTER_ERROR:", err); // server-only log

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        errors: { email: "Email not found" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        errors: { password: "Incorrect password" },
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profile: user.profile,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* =========================
   ADD PROFILE
========================= */
export const addProfile = async (req: Request, res: Response) => {
  const { userId, profile } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profile) user.profile = [];

    if (user.profile.length >= 3) {
      return res.status(400).json({
        message: "Max 3 profiles allowed",
      });
    }

    user.profile.push(profile);

    await user.save();

    return res.status(200).json({
      message: "Profile added successfully",
      user,
    });
  } catch (err) {
    console.error("ADD_PROFILE_ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* =========================
   GET PROFILES
========================= */
export const getProfiles = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.profile || []);
  } catch (err) {
    console.error("GET_PROFILES_ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* =========================
   DELETE PROFILE
========================= */
export const deleteProfile = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const before = user.profile.length;

    user.profile = user.profile.filter(
      (p: any) => String(p._id ?? p.id) !== profileId,
    );

    if (before === user.profile.length) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await user.save();

    return res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("DELETE_PROFILE_ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changePassword = async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Current password incorrect",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password must include uppercase, number, special character",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return res.json({
      message: "Password updated",
    });
  } catch (err) {
    console.error("CHANGE_PASSWORD_ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
