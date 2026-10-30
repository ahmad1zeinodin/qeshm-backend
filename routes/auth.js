import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'qeshm-secret-key';

// ۱. لاگین با ایمیل و رمز عبور
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { user, token }, message: 'ورود با موفقیت انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ۲. درخواست کد یکبار مصرف (OTP)
router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: 'کاربری با این شماره یافت نشد.' });

    // تولید کد ۶ رقمی
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // ۲ دقیقه اعتبار

    user.otpCode = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    // در دنیای واقعی اینجا باید پیامک ارسال شود. فعلاً در کنسول چاپ می‌کنیم.
    console.log(`📱 کد OTP برای ${phone} ارسال شد: ${otpCode}`);

    res.json({ success: true, message: 'کد تایید ارسال شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ۳. ورود با کد یکبار مصرف (OTP)
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const user = await User.findOne({ phone });
    
    if (!user || user.otpCode !== code) {
      return res.status(400).json({ success: false, message: 'کد وارد شده نامعتبر است.' });
    }
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'کد منقضی شده است.' });
    }

    // پاک کردن کد بعد از استفاده
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { user, token }, message: 'ورود با موفقیت انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ۴. تغییر پسورد (توسط خود کاربر یا ادمین)
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, targetUserId } = req.body;
    
    let userToUpdate;
    if (req.user.role === 'admin' && targetUserId) {
      userToUpdate = await User.findById(targetUserId);
    } else {
      userToUpdate = await User.findById(req.user.id);
      if (!currentPassword) return res.status(400).json({ success: false, message: 'رمز عبور فعلی الزامی است.' });
      const isMatch = await bcrypt.compare(currentPassword, userToUpdate.passwordHash);
      if (!isMatch) return res.status(401).json({ success: false, message: 'رمز عبور فعلی اشتباه است.' });
    }

    if (!userToUpdate) return res.status(404).json({ success: false, message: 'کاربر پیدا نشد.' });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ success: false, message: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.' });

    userToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
    await userToUpdate.save();

    res.json({ success: true, message: 'رمز عبور با موفقیت تغییر کرد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ۵. دریافت اطلاعات کاربر فعلی
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'کاربر پیدا نشد.' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;