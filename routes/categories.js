import express from 'express';
import Category from '../models/Category.js';
import MainField from '../models/MainField.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

router.get('/main-fields', async (req, res) => {
  try {
    const fields = await MainField.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: fields });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/main-fields', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'نام فیلد اصلی الزامی است.' });
    const field = await MainField.create({ name, icon });
    res.status(201).json({ success: true, data: field, message: 'فیلد اصلی اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/main-fields/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const field = await MainField.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: field, message: 'تغییرات ذخیره شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ✅ روت جدید برای پاک کردن همه فیلدها و زیرشاخه‌ها
router.delete('/main-fields/delete-all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await MainField.deleteMany({});
    await Category.deleteMany({});
    res.json({ success: true, message: 'تمام فیلدها و زیرشاخه‌ها پاک شدند.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { mainField } = req.query;
    let query = { isActive: true };
    if (mainField) query.mainField = mainField;
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, mainField, icon, depositPercent, commissionPercent, taxPercent, showTax } = req.body;
    if (!name || !mainField) return res.status(400).json({ success: false, message: 'نام شاخه و فیلد اصلی الزامی است.' });
    const category = await Category.create({ name, mainField, icon, depositPercent: Number(depositPercent) || 30, commissionPercent: Number(commissionPercent) || 10, taxPercent: Number(taxPercent) || 10, showTax });
    res.status(201).json({ success: true, data: category, message: 'شاخه اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'شاخه حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;