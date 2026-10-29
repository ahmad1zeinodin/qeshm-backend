import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// دریافت سفیران ویژه (Featured)
router.get('/featured', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true }).limit(4);
    res.json({ success: true, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// دریافت لیست سفیران آنلاین (برای صفحه خدمات)
router.get('/online', async (req, res) => {
  try {
    const workers = await User.find({
      role: 'worker',
      isOnline: true,
      isSuspended: false,
    }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// دریافت سفیران یک دسته‌بندی خاص
router.get('/category/:categoryId', async (req, res) => {
  try {
    const workers = await User.find({
      role: 'worker',
      isOnline: true,
      isSuspended: false,
      // فعلاً فیلتر بر اساس مهارت را انجام نمی‌دهیم تا داده‌ها نمایش داده شوند
    }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// دریافت اطلاعات یک سفیر
router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
