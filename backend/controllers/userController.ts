import { Request, Response } from 'express';
import User from '../models/user';
import { profile } from 'console';

// Register User
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
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
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
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
export const addProfile = async (req: Request, res: Response) => {
  const { userId, profile } = req.body;

  if (!userId || !profile) {
    return res.status(400).json({ message: 'UserId and Profile are required' });
  }

  try {
    //Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profile) {
      user.profile = [];
    }

    if (user.profile.length >= 3) {
      return res
        .status(400)
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
export const getProfiles = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
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
  }
};
