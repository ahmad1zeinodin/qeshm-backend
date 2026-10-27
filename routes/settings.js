import express from 'express';
import Settings from '../models/Settings.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// GET /api/settings — دریافت تنظیمات (عمومی)
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
      settings = await Settings.create({ aboutUs, contactPhone, contactEmail, contactAddress });
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
