import { Request, Response } from 'express';
import User from '../models/user';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ---------- Forgot Password (Send OTP) ----------
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
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
      },
    });

    await transporter.sendMail({
      from: `"AI Nutritionist" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ---------- Verify OTP ----------
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

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
  }
};

// ---------- Reset Password ----------
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

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
  }
};
