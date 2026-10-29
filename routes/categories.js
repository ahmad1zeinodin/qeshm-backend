import express from 'express';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// دریافت همه دسته‌بندی‌ها
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن دسته‌بندی جدید (توسط ادمین)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, icon, depositAmount, taxPercent, showTax } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'نام دسته‌بندی الزامی است.' });
    const category = await Category.create({ name, icon, depositAmount, taxPercent, showTax });
    res.status(201).json({ success: true, data: category, message: 'دسته‌بندی اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف دسته‌بندی (توسط ادمین)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'دسته‌بندی حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;