import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت سفیران ویژه
router.get('/featured', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true }).limit(4);
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت لیست سفیران آنلاین
router.get('/online', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true, isSuspended: false }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت سفیران یک دسته‌بندی خاص (فقط آنلاین‌ها)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const workers = await User.find({
      role: 'worker',
      isOnline: true,
      isSuspended: false,
      categoryId: req.params.categoryId
    }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ✅ تغییر وضعیت آنلاین/آفلاین توسط خود سفیر
router.put('/me/online-status', authenticateToken, async (req, res) => {
  try {
    const { isOnline } = req.body;
    if (req.user.role !== 'worker') return res.status(403).json({ success: false, message: 'فقط سفیران می‌توانند وضعیت خود را تغییر دهند.' });
    
    await User.findByIdAndUpdate(req.user.id, { isOnline });
    res.json({ success: true, message: 'وضعیت با موفقیت تغییر کرد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت اطلاعات یک سفیر
router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: worker });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;