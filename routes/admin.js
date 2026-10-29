import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Wallet from '../models/Wallet.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' });
  next();
};

// دریافت همه کاربران
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت لیست سفیران
router.get('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت‌نام سفیر جدید توسط ادمین (با تمام اطلاعات)
router.post('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, nationalId, emergencyPhone, sheba, adminBadgeText, profilePhoto, nationalCardPhoto, selfiePhoto } = req.body;
    
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'نام، ایمیل و رمز عبور الزامی است.' });
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'این ایمیل قبلاً ثبت شده است.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const worker = await User.create({
      name, email, phone, passwordHash, nationalId, emergencyPhone, sheba, adminBadgeText, profilePhoto, nationalCardPhoto, selfiePhoto,
      role: 'worker',
      isVerified: true // ادمین که ثبت میکنه یعنی تایید شده
    });

    res.status(201).json({ success: true, data: worker, message: 'سفیر با موفقیت ثبت‌نام شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تغییر وضعیت سفیر (تعلیق/فعال)
router.put('/workers/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const worker = await User.findByIdAndUpdate(req.params.id, { isSuspended: req.body.isSuspended }, { new: true }).select('-passwordHash');
    res.json({ success: true, data: worker });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت همه سفارشات
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('clientId', 'name phone').populate('workerId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تغییر وضعیت سفارش یا ارجاع مجدد
router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, newWorkerId } = req.body;
    const updateData = { status };
    if (newWorkerId) {
      updateData.workerId = newWorkerId;
      updateData.reassignedTo = newWorkerId;
    }
    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: order, message: 'سفارش آپدیت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
