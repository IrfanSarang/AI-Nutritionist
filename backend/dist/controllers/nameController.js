"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProfileName = void 0;
const user_1 = __importDefault(require("../models/user"));
// Fetch profile name by profileId
const fetchProfileName = async (req, res) => {
    const { profileId } = req.params;
    try {
        // Find user containing this profile
        const user = await user_1.default.findOne({ 'profile._id': profileId });
        if (!user)
            return res.status(404).json({ message: 'Profile not found' });
        // Find the profile object
        const profile = user.profile.find(p => p._id.toString() === profileId);
        if (!profile)
            return res.status(404).json({ message: 'Profile not found' });
        return res.status(200).json({ name: profile.name });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.fetchProfileName = fetchProfileName;
//# sourceMappingURL=nameController.js.map