<<<<<<< HEAD
import { Request, Response } from "express";
import User from "../models/user";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

=======
import { Request, Response } from 'express';
import User from '../models/user';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
dotenv.config();

// ---------- Forgot Password (Send OTP) ----------
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
<<<<<<< HEAD
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0; // reset attempts on new OTP
    await user.save();

    // Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
=======
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    await user.save();

    // Setup Nodemailer for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // use service, not host
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // App Password
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
      },
    });

    await transporter.sendMail({
      from: `"AI Nutritionist" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
<<<<<<< HEAD
      subject: "Your OTP for Password Reset",
      html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
=======
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
  }
};

// ---------- Verify OTP ----------
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

<<<<<<< HEAD
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    // 🔒 OTP lockout check (NEW)
    if ((user.otpAttempts || 0) >= 5) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      user.otpAttempts = 0;
      await user.save();

      return res
        .status(429)
        .json({ message: "Too many attempts. Request a new OTP." });
    }

    // ⏰ Expiry check
    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ❌ Invalid OTP handling (MODIFIED)
    if (user.resetToken !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Successful OTP match (NEW RESET)
    user.otpAttempts = 0;
    await user.save();

    return res.status(200).json({
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
=======
    if (!user) return res.status(404).json({ message: 'User not found' });

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
  }
};

// ---------- Reset Password ----------
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

<<<<<<< HEAD
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    if (user.resetToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔐 Secure password hashing (FIXED)
    user.password = await bcrypt.hash(newPassword, 12);

    // cleanup
    user.resetToken = null;
    user.resetTokenExpiry = null;
    user.otpAttempts = 0;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
=======
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.resetToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetTokenExpiry! < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // ⚠️ Save password as plain text (not secure)
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
>>>>>>> f1f10efe7f9655be7e016c5d01858dc787bbe637
  }
};
