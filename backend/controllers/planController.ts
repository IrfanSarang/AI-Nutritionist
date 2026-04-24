import { Request, Response } from 'express';
import User, { IPlan } from '../models/user';
import mongoose from 'mongoose';

type MealType = 'breakfast' | 'lunch' | 'dinner';

// Fetch meal plan for a profile
export const fetchMeal = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = user.profile.find(p => p._id.toString() === profileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    return res.status(200).json({
      breakfast: profile.plan[0]?.breakfast || [],
      lunch: profile.plan[0]?.lunch || [],
      dinner: profile.plan[0]?.dinner || [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Add single meal item
export const addMealItem = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  const { mealType, item } = req.body as { mealType: MealType; item: string };

  try {
    if (!['breakfast', 'lunch', 'dinner'].includes(mealType))
      return res.status(400).json({ message: 'Invalid meal type' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = user.profile.find(p => p._id.toString() === profileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Initialize plan if missing
    if (!profile.plan || profile.plan.length === 0) {
      profile.plan = [{ breakfast: [], lunch: [], dinner: [] }];
    }

    const plan = profile.plan[0] as IPlan;
    plan[mealType] = plan[mealType] || [];
    plan[mealType].push(item);

    await user.save();

    return res.status(201).json({
      message: `Item added to ${mealType}`,
      [mealType]: plan[mealType],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Delete a meal item
export const deleteMealItem = async (req: Request, res: Response) => {
  const { userId, profileId } = req.params;
  const { mealType, item } = req.body as { mealType: MealType; item: string }; // Get the 'item' value instead of 'index'

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = user.profile.find(p => p._id.toString() === profileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const plan = profile.plan[0];
    if (!plan || !plan[mealType]) {
      return res.status(400).json({ message: 'Invalid meal plan or type' });
    }

    // Find the index of the item to delete
    const itemIndex = plan[mealType].indexOf(item);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Meal item not found' });
    }

    plan[mealType].splice(itemIndex, 1);
    await user.save();

    return res.status(200).json({
      message: `Item removed from ${mealType}`,
      [mealType]: plan[mealType],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

///fetching ProfileId
export const fetchProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.profile || user.profile.length === 0) {
      return res.status(404).json({ message: 'No profiles found' });
    }

    // Safe access with optional chaining
    const firstProfileId = user.profile?.[0]?._id;

    if (!firstProfileId) {
      return res.status(404).json({ message: 'No profile ID found' });
    }

    return res.status(200).json({ profileId: firstProfileId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
