import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/me/online-status', authenticateToken, async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    // دریافت شناسه کاربر از توکن و چک کردن مستقیم از دیتابیس برای جلوگیری از خطای تویستی توکن
    const userId = req.user.id || req.user._id;
    const currentUser = await User.findById(userId);

    if (!currentUser || currentUser.role !== 'worker') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only workers can change status.', 
        receivedRole: currentUser?.role 
      });
    }

    currentUser.isOnline = isOnline;
    await currentUser.save();

    res.json({ success: true, message: 'Status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true, isSuspended: { $ne: true } }).limit(4);
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/online', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true, isSuspended: { $ne: true } }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const workers = await User.find({
      role: 'worker',
      isOnline: true,
      isSuspended: { $ne: true },
      categoryId: req.params.categoryId
    }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: worker });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;