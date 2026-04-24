<<<<<<< HEAD
import { Request, Response } from "express";
import User from "../models/user";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER USER =================
=======
import { Request, Response } from 'express';
import User from '../models/user';
import { profile } from 'console';

// Register User
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
<<<<<<< HEAD
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
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// ================= LOGIN USER =================
=======
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ fullName, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

// Login User
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
<<<<<<< HEAD
      return res.status(401).json({ errors: { email: "Email not found" } });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errors: { password: "Incorrect password" } });
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
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// ================= ADD PROFILE =================
=======
      // ❌ Email not found
      return res.status(401).json({ errors: { email: 'Email not found' } });
    }

    if (user.password !== password) {
      // ❌ Password incorrect
      return res
        .status(401)
        .json({ errors: { password: 'Incorrect password' } });
    }

    // ✅ Successful login
    return res.json({
      message: 'Login successful',
      user: user,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ errors: { general: 'Error logging in' } });
  }
};

//Add New Profile
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
export const addProfile = async (req: Request, res: Response) => {
  const { userId, profile } = req.body;

  if (!userId || !profile) {
<<<<<<< HEAD
    return res.status(400).json({ message: "UserId and Profile are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
=======
    return res.status(400).json({ message: 'UserId and Profile are required' });
  }

  try {
    //Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
    }

    if (!user.profile) {
      user.profile = [];
    }

    if (user.profile.length >= 3) {
      return res
        .status(400)
<<<<<<< HEAD
        .json({ message: "You can only make up to 3 profiles" });
    }

    user.profile.push(profile);
    await user.save();

    return res.status(200).json({
      message: "Profile added successfully",
      user,
    });
  } catch (err) {
    console.error("Error adding profile:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// ================= GET PROFILES =================
=======
        .json({ message: 'You can only make up to 3 profiles' });
    }
    user.profile.push(profile);
    await user.save();

    return res
      .status(200)
      .json({ message: 'Profile added successfully', user });
  } catch (error) {
    console.error('Error adding profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get profiles of a user
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
export const getProfiles = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
<<<<<<< HEAD
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.profile || []);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// ================= DELETE PROFILE =================
export const deleteProfile = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const originalLength = user.profile.length;

    user.profile = user.profile.filter(
      (p: any) => String(p._id ?? p.id) !== profileId,
    );

    if (user.profile.length === originalLength) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await user.save();

    return res.status(200).json({ message: "Profile deleted" });
  } catch (err) {
    console.error("Error deleting profile:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Something went wrong." });
=======
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user.profile || []);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//fetch profiles and return
export const fetchData = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, { fullName: 1, email: 1, profile: 1 });
    // returning only necessary fields

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a profile from a user
export const deleteProfile = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove profile by _id (MongoDB ObjectId)
    user.profile = user.profile.filter(
      (p: any) => String(p._id ?? p.id) !== profileId,
    );
    await user.save();
    return res.status(200).json({ message: 'Profile deleted' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
  }
};
