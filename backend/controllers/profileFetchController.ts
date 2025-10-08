import { Request, Response } from 'express';
import User from '../models/user'; // Adjust path as needed

// ✅ Get profile by ID
export const getProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Find the user containing this profile
    const user = await User.findOne({ 'profile._id': id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use Array.find() instead of .id()
    const profile = user.profile.find((p: any) => p._id.toString() === id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Update profile by ID
export const updateProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findOne({ 'profile._id': id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use Array.find() instead of .id()
    const profile = user.profile.find((p: any) => p._id.toString() === id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Merge updates into profile
    Object.assign(profile, updates);

    await user.save();
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
