import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// POST /api/verify/shahkar — استعلام کد ملی و شماره موبایل
router.post('/shahkar', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { nationalCode, mobile } = req.body;
    if (!nationalCode || !mobile) {
      return res.status(400).json({ success: false, message: 'کد ملی و شماره موبایل الزامی است.' });
    }

    const apiKey = process.env.SHAHKAR_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'کلید API شاهکار در تنظیمات سرور تعریف نشده است.' });
    }

    // این آدرس باید بر اساس مستندات شبانیک تنظیم شود
    const response = await axios.post('https://api.shabanic.com/v1/shahkar', {
      national_code: nationalCode,
      mobile: mobile,
    }, {
      headers: { 'Authorization': 'Bearer ' + apiKey }
    });

    res.json({ success: true, data: response.data, message: 'استعلام انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
