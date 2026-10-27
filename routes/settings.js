import express from 'express';
import Settings from '../models/Settings.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// روت موقت برای پاکسازی رکورد خراب (فقط یک بار اجرا شود)
router.delete('/clear', async (req, res) => {
  try {
    await Settings.deleteMany({});
    res.json({ success: true, message: 'رکوردهای تنظیمات پاک شدند.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/settings — دریافت تنظیمات (با دیتابیس)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings — ویرایش تنظیمات (فقط ادمین)
router.put('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { aboutUs, contactPhone, contactEmail, contactAddress, prayerTimes } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ aboutUs, contactPhone, contactEmail, contactAddress, prayerTimes });
    } else {
      settings.aboutUs = aboutUs || settings.aboutUs;
      settings.contactPhone = contactPhone || settings.contactPhone;
      settings.contactEmail = contactEmail || settings.contactEmail;
      settings.contactAddress = contactAddress || settings.contactAddress;
      settings.prayerTimes = prayerTimes || settings.prayerTimes;
      settings.updatedAt = new Date();
      await settings.save();
    }
    res.json({ success: true, data: settings, message: 'تنظیمات ذخیره شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
