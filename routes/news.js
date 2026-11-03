import express from 'express';
import News from '../models/News.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت همه اخبار (با فیلتر دسته‌بندی)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;

    const news = await News.find(query).populate('authorId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت یک خبر خاص
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('authorId', 'name');
    if (!news) return res.status(404).json({ success: false, message: 'خبر پیدا نشد.' });
    res.json({ success: true, data: news });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت خبر جدید
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'عنوان و متن الزامی است.' });

    const news = await News.create({
      title, content, image, category: category || 'اخبار عمومی', authorId: req.user.id
    });
    res.status(201).json({ success: true, data: news, message: 'خبر ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف خبر
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'خبر حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;