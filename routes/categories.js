import express from 'express';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// دریافت همه دسته‌بندی‌ها (اختیاری: فیلتر بر اساس فیلد اصلی)
router.get('/', async (req, res) => {
  try {
    const { mainField } = req.query;
    let query = { isActive: true };
    if (mainField) query.mainField = mainField;
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن شاخه جدید (توسط ادمین)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, mainField, icon, depositAmount, taxPercent, showTax } = req.body;
    if (!name || !mainField) return res.status(400).json({ success: false, message: 'نام شاخه و فیلد اصلی الزامی است.' });
    const category = await Category.create({ name, mainField, icon, depositAmount, taxPercent, showTax });
    res.status(201).json({ success: true, data: category, message: 'شاخه اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف شاخه (توسط ادمین)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'شاخه حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;