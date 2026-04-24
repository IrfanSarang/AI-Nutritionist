"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.fetchData = exports.getProfiles = exports.addProfile = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
// Register User
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const newUser = new user_1.default({ fullName, email, password });
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Error registering user', error: err });
    }
};
exports.registerUser = registerUser;
// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
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
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ errors: { general: 'Error logging in' } });
    }
};
exports.loginUser = loginUser;
//Add New Profile
const addProfile = async (req, res) => {
    const { userId, profile } = req.body;
    if (!userId || !profile) {
        return res.status(400).json({ message: 'UserId and Profile are required' });
    }
    try {
        //Find the user by ID
        const user = await user_1.default.findById(userId);
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
    }
    catch (error) {
        console.error('Error adding profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.addProfile = addProfile;
// Get profiles of a user
const getProfiles = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user.profile || []);
    }
    catch (error) {
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProfiles = getProfiles;
//fetch profiles and return
const fetchData = async (req, res) => {
    try {
        const users = await user_1.default.find({}, { fullName: 1, email: 1, profile: 1 });
        // returning only necessary fields
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.fetchData = fetchData;
// Delete a profile from a user
const deleteProfile = async (req, res) => {
    const { userId, profileId } = req.params;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Remove profile by _id (MongoDB ObjectId)
        user.profile = user.profile.filter((p) => String(p._id ?? p.id) !== profileId);
        await user.save();
        return res.status(200).json({ message: 'Profile deleted' });
    }
    catch (error) {
        console.error('Error deleting profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteProfile = deleteProfile;
//# sourceMappingURL=userController.js.map