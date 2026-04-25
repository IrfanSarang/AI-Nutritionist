import { Request, Response } from "express";
import User from "../models/user";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// =========================
// FORGOT PASSWORD (SEND OTP)
// =========================
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"AI Nutritionist" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: "Your OTP for Password Reset",
      html: `<p>Your OTP is: <b>${otp}</b>. Valid for 10 minutes.</p>`,
    });

    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =========================
// VERIFY OTP (SECURED)
// =========================
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    // ⛔ EXPIRY CHECK
    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔒 BRUTE FORCE PROTECTION
    if ((user.otpAttempts || 0) >= 5) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      user.otpAttempts = 0;
      await user.save();

      return res.status(429).json({
        message: "Too many attempts. Request new OTP.",
      });
    }

    // ❌ WRONG OTP
    if (user.resetToken !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ✅ SUCCESS
    user.otpAttempts = 0;
    await user.save();

    return res.json({
      message: "OTP verified. You can reset password.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =========================
// RESET PASSWORD (HARDENED)
// =========================
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    // ⛔ EXPIRY CHECK
    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔒 BLOCK IF TOO MANY ATTEMPTS
    if ((user.otpAttempts || 0) >= 5) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      user.otpAttempts = 0;
      await user.save();

      return res.status(429).json({
        message: "OTP locked. Request new OTP.",
      });
    }

    // ❌ INVALID OTP
    if (user.resetToken !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // 🔐 HASH PASSWORD
    user.password = await bcrypt.hash(newPassword, 12);

    // 🧹 CLEANUP
    user.resetToken = null;
    user.resetTokenExpiry = null;
    user.otpAttempts = 0;

    await user.save();

    return res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
