import express from 'express';
import News from '../models/News.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// تنظیمات آپلود عکس
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET /api/news — دریافت اخبار (همه برای ادمین، فقط تایید شده‌ها برای عموم)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { status: 'approved' };
    const news = await News.find(filter).populate('reporterId', 'name').sort({ publishedAt: -1 });
    res.json({ success: true, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/news/:id
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('reporterId', 'name');
    if (!news) return res.status(404).json({ success: false, message: 'خبر یافت نشد' });
    res.json({ success: true, data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/news — ارسال خبر جدید (فقط خبرنگار)
router.post('/', authenticateToken, requireRole('reporter'), upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'عنوان و متن الزامی است' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const news = await News.create({
      title,
      content,
      imageUrl,
      reporterId: req.user.id,
      status: 'pending',
    });
    res.status(201).json({ success: true, data: news, message: 'خبر برای بررسی ارسال شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/news/:id/approve — تایید خبر توسط ادمین (و پرداخت به خبرنگار)
router.put('/:id/approve', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { reporterFee } = req.body; // مبلغ پرداختی که ادمین تعیین می‌کند
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'خبر یافت نشد' });

    news.status = 'approved';
    news.publishedAt = new Date();
    news.reporterFee = reporterFee || 0;

    // افزایش موجودی خبرنگار
    if (reporterFee && news.reporterId) {
      await User.findByIdAndUpdate(news.reporterId, { $inc: { reporterBalance: reporterFee } });
    }

    await news.save();
    res.json({ success: true, data: news, message: 'خبر تایید و منتشر شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/news/:id/reject — رد خبر توسط ادمین
router.put('/:id/reject', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'خبر یافت نشد' });
    news.status = 'rejected';
    await news.save();
    res.json({ success: true, message: 'خبر رد شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
