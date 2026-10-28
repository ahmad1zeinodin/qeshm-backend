import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ثبت‌نام
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'نام، ایمیل و رمز عبور الزامی است.' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'این ایمیل قبلاً ثبت شده است.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, phone, passwordHash, role: 'client' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'qeshm-secret-key', { expiresIn: '7d' });

    res.status(201).json({ success: true, data: { user, token }, message: 'ثبت‌نام با موفقیت انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ورود
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'ایمیل و رمز عبور الزامی است.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'qeshm-secret-key', { expiresIn: '7d' });
    res.json({ success: true, data: { user, token }, message: 'ورود با موفقیت انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// دریافت اطلاعات کاربر لاگین شده
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'کاربر یافت نشد.' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
