import express from 'express';
import Category from '../models/Category.js';
import MainField from '../models/MainField.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// دریافت لیست فیلدها
router.get('/main-fields', async (req, res) => {
  try {
    const fields = await MainField.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: fields });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت فیلد جدید
router.post('/main-fields', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'نام الزامی است.' });
    
    const existing = await MainField.findOne({ name });
    if (existing) {
      // اگر از قبل بود، فقط فعالش کن (ارور نده)
      existing.isActive = true;
      await existing.save();
      return res.status(200).json({ success: true, data: existing, message: 'فیلد از قبل وجود داشت و فعال شد.' });
    }
    
    const field = await MainField.create({ name, icon });
    res.status(201).json({ success: true, data: field, message: 'فیلد اصلی اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تغییر وضعیت نمایش
router.put('/main-fields/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const field = await MainField.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: field, message: 'تغییرات ذخیره شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت زیرشاخه‌ها
router.get('/', async (req, res) => {
  try {
    const { mainField } = req.query;
    let query = { isActive: true };
    if (mainField) query.mainField = mainField;
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت زیرشاخه
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, mainField, icon, depositPercent, commissionPercent, taxPercent, showTax } = req.body;
    if (!name || !mainField) return res.status(400).json({ success: false, message: 'نام و فیلد اصلی الزامی است.' });
    const category = await Category.create({ name, mainField, icon, depositPercent: Number(depositPercent) || 30, commissionPercent: Number(commissionPercent) || 10, taxPercent: Number(taxPercent) || 10, showTax });
    res.status(201).json({ success: true, data: category, message: 'شاخه اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف زیرشاخه
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;