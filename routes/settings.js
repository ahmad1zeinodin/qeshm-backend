import express from 'express';
import Settings from '../models/Settings.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// تنظیمات پیش‌فرض (بدون دیتابیس)
const defaultSettings = {
  aboutUs: 'پلتفرم جامع خدمات، گردشگری و نیازمندی‌های جزیره قشم.',
  contactPhone: '076-3222XXXX',
  contactEmail: 'info@qeshminoo.ir',
  contactAddress: 'جزیره قشم، بلوار امام خمینی، ساختمان قشمی نو',
  prayerTimes: {
    fajr: '۰۵:۱۲',
    sunrise: '۰۶:۳۰',
    dhuhr: '۱۱:۵۸',
    sunset: '۱۷:۲۵',
    maghrib: '۱۷:۴۳',
  },
};

// GET /api/settings — دریافت تنظیمات (بدون دیتابیس)
router.get('/', async (req, res) => {
  res.json({ success: true, data: defaultSettings });
});

// PUT /api/settings — ذخیره تنظیمات (فعلاً غیرفعال)
router.put('/', authenticateToken, requireRole('admin'), async (req, res) => {
  res.json({ success: true, data: defaultSettings, message: 'تنظیمات ذخیره شد (فعلاً در حافظه).' });
});

export default router;
