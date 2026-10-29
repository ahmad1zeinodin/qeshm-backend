import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// میان‌افزار چک کردن ادمین
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز. فقط ادمین.' });
  }
  next();
};

// دریافت لیست همه کاربران
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// دریافت لیست همه سفیران (برای تایید یا رد کردن)
router.get('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// تغییر وضعیت سفیر (تایید یا تعلیق)
router.put('/workers/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isSuspended } = req.body;
    const worker = await User.findByIdAndUpdate(req.params.id, { isSuspended }, { new: true }).select('-passwordHash');
    if (!worker) return res.status(404).json({ success: false, message: 'سفیر یافت نشد.' });
    res.json({ success: true, data: worker, message: 'وضعیت سفیر تغییر کرد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
