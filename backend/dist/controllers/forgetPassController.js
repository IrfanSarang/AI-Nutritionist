"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = void 0;
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ---------- Forgot Password (Send OTP) ----------
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetToken = otp;
        user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
        await user.save();
        // Setup Nodemailer for Gmail
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail', // use service, not host
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD, // App Password
            },
        });
        await transporter.sendMail({
            from: `"AI Nutritionist" <${process.env.EMAIL_USERNAME}>`,
            to: user.email,
            subject: 'Your OTP for Password Reset',
            html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        });
        res.status(200).json({ message: 'OTP sent to your email' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.forgotPassword = forgotPassword;
// ---------- Verify OTP ----------
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (!user.resetToken || !user.resetTokenExpiry) {
            return res.status(400).json({ message: 'OTP not generated' });
        }
        if (user.resetToken !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        res
            .status(200)
            .json({ message: 'OTP verified. You can now reset your password.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.verifyOtp = verifyOtp;
// ---------- Reset Password ----------
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (user.resetToken !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        // ⚠️ Save password as plain text (not secure)
        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=forgetPassController.js.map