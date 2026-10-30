import express from 'express';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت لیست پیام‌های کاربر
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifications });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// علامت‌گذاری یک پیام به عنوان خوانده شده
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
