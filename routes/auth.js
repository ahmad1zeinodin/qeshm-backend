import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'qeshm-secret-key';

// ۱. لاگین
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

// ۲. ثبت‌نام (برای مشتریان)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'همه فیلدها الزامی است.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'این ایمیل قبلاً ثبت شده است.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, role: 'client' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { user, token }, message: 'ثبت‌نام با موفقیت انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ۳. تغییر پسورد (توسط خود کاربر یا ادمین)
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, targetUserId } = req.body;
    
    // اگر ادمین است و می‌خواهد پسورد کس دیگری را عوض کند
    let userToUpdate;
    if (req.user.role === 'admin' && targetUserId) {
      userToUpdate = await User.findById(targetUserId);
    } else {
      // اگر کاربر عادی است، باید پسورد فعلی را وارد کند
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

// ۴. دریافت اطلاعات کاربر فعلی (برای پنل)
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