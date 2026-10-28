import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// دریافت سفیران یک دسته‌بندی خاص
router.get('/category/:categoryId', async (req, res) => {
  try {
    // فعلاً بر اساس مهارت‌ها یا فیلد جستجو می‌کنیم
    const workers = await User.find({
      role: 'worker',
      isOnline: true,
      isSuspended: false,
      // اینجا می‌تونیم بر اساس دسته‌بندی فیلتر کنیم (مثلاً skills)
    }).select('-passwordHash -adminPermissions');
    
    res.json({ success: true, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
