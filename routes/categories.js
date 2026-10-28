import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// دریافت همه دسته‌بندی‌ها
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
