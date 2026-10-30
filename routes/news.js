import express from 'express';
import News from '../models/News.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت همه اخبار
router.get('/', async (req, res) => {
  try {
    const news = await News.find().populate('authorId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ثبت خبر جدید
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'عنوان و متن الزامی است.' });

    const news = await News.create({
      title, content, image, authorId: req.user.id
    });
    res.status(201).json({ success: true, data: news, message: 'خبر ثبت شد.' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// حذف خبر
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'خبر حذف شد.' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

export default router;import express from 'express';
import News from '../models/News.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const news = await News.find().populate('authorId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'عنوان و متن الزامی است.' });
    const news = await News.create({ title, content, image, authorId: req.user.id });
    res.status(201).json({ success: true, data: news, message: 'خبر ثبت شد.' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'خبر حذف شد.' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

export default router;