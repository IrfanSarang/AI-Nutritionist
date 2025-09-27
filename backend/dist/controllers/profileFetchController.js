"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileById = exports.getProfileById = void 0;
const user_1 = __importDefault(require("../models/user")); // Adjust path as needed
// ✅ Get profile by ID
const getProfileById = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the user containing this profile
        const user = await user_1.default.findOne({ 'profile._id': id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Use Array.find() instead of .id()
        const profile = user.profile.find((p) => p._id.toString() === id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        return res.status(200).json(profile);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProfileById = getProfileById;
// ✅ Update profile by ID
const updateProfileById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const user = await user_1.default.findOne({ 'profile._id': id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Use Array.find() instead of .id()
        const profile = user.profile.find((p) => p._id.toString() === id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        // Merge updates into profile
        Object.assign(profile, updates);
        await user.save();
        return res.status(200).json(profile);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProfileById = updateProfileById;
//# sourceMappingURL=profileFetchController.js.map