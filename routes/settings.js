import express from 'express';
import Settings from '../models/Settings.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// دریافت همه تنظیمات (برای فرانت‌اند)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const data = {};
    settings.forEach(s => { data[s.key] = s.value; });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ذخیره یا به‌روزرسانی تنظیمات (فقط ادمین)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settingsData = req.body;
    for (const [key, value] of Object.entries(settingsData)) {
      await Settings.findOneAndUpdate(
        { key },
        { value, updatedAt: Date.now() },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, message: 'تنظیمات با موفقیت ذخیره شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;