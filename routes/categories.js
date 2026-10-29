import express from 'express';
import MainField from '../models/MainField.js';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// ==================== APIهای فیلد اصلی ====================

// دریافت همه فیلدهای اصلی
router.get('/main-fields', async (req, res) => {
  try {
    const fields = await MainField.find({ isActive: true }).sort({ createdAt: 1 });
    res.json({ success: true, data: fields });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن فیلد اصلی جدید (فقط ادمین)
router.post('/main-fields', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'نام فیلد الزامی است.' });
    const field = await MainField.create({ name });
    res.status(201).json({ success: true, data: field, message: 'فیلد اصلی اضافه شد.' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'این فیلد قبلاً وجود دارد.' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== APIهای زیرشاخه ====================

// دریافت زیرشاخه‌ها (با فیلتر بر اساس فیلد اصلی)
router.get('/', async (req, res) => {
  try {
    const { mainField } = req.query;
    let query = { isActive: true };
    if (mainField) query.mainField = mainField;
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن زیرشاخه جدید
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, mainField, icon, depositAmount, taxPercent, showTax } = req.body;
    if (!name || !mainField) return res.status(400).json({ success: false, message: 'نام شاخه و فیلد اصلی الزامی است.' });
    const category = await Category.create({ name, mainField, icon, depositAmount, taxPercent, showTax });
    res.status(201).json({ success: true, data: category, message: 'زیرشاخه اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف زیرشاخه
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'زیرشاخه حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;