import express from 'express';
import Settings from '../models/Settings.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت همه تنظیمات
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const data = {};
    settings.forEach(s => { data[s.key] = s.value; });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ذخیره یا به‌روزرسانی تنظیمات (فقط ادمین)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' });
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ success: false, message: 'کلید و مقدار الزامی است.' });

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting, message: 'تنظیمات ذخیره شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
