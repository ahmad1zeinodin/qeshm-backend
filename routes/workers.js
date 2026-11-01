import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/me/online-status', authenticateToken, async (req, res) => {
  try {
    const { isOnline } = req.body;
    if (req.user.role !== 'worker') {
      return res.status(403).json({ success: false, message: 'Only workers can change status.' });
    }
    await User.findByIdAndUpdate(req.user.id, { isOnline });
    res.json({ success: true, message: 'Status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true }).limit(4);
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/online', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true, isSuspended: false }).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

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

// ✅ مسیر تست برای دیباگ
router.get('/debug/:categoryId', async (req, res) => {
  try {
    const workers = await User.find({ categoryId: req.params.categoryId });
    res.json({ 
      success: true, 
      count: workers.length,
      data: workers.map(w => ({ 
        name: w.name, 
        categoryId: w.categoryId, 
        isOnline: w.isOnline, 
        isSuspended: w.isSuspended, 
        role: w.role 
      }))
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-passwordHash -adminPermissions');
    res.json({ success: true, data: worker });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;