import { Request, Response } from 'express';
import User from '../models/user';

// Fetch profile name by profileId
export const fetchProfileName = async (req: Request, res: Response) => {
  const { profileId } = req.params;

  try {
    // Find user containing this profile
    const user = await User.findOne({ 'profile._id': profileId });

    if (!user) return res.status(404).json({ message: 'Profile not found' });

    // Find the profile object
    const profile = user.profile.find(p => p._id.toString() === profileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    return res.status(200).json({ name: profile.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
