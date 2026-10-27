import express from 'express';
import Skill from '../models/Skill.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// GET /api/skills — دریافت لیست مهارت‌های فعال (عمومی برای فرم ثبت‌نام)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills — افزودن مهارت جدید (فقط ادمین)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'نام و دسته‌بندی الزامی است.' });
    }
    const skill = await Skill.create({ name, category, description });
    res.status(201).json({ success: true, data: skill, message: 'مهارت اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/skills/:id — ویرایش مهارت (فقط ادمین)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, category, description, isActive } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, category, description, isActive },
      { new: true }
    );
    if (!skill) return res.status(404).json({ success: false, message: 'مهارت یافت نشد.' });
    res.json({ success: true, data: skill, message: 'مهارت ویرایش شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/:id — حذف مهارت (فقط ادمین)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'مهارت یافت نشد.' });
    res.json({ success: true, message: 'مهارت حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
