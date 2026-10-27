import express from 'express';
import Skill from '../models/Skill.js';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// ==================== API های شاخه‌ها (Category) ====================

// GET /api/skills/categories — دریافت لیست شاخه‌ها
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills/categories — افزودن شاخه جدید
router.post('/categories', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'نام شاخه الزامی است.' });
    const category = await Category.create({ name });
    res.status(201).json({ success: true, data: category, message: 'شاخه اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/categories/:id — حذف شاخه
router.delete('/categories/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'شاخه حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== API های مهارت‌ها (Skill) ====================

// GET /api/skills — دریافت لیست همه مهارت‌ها
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).populate('categoryId', 'name').sort({ name: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills — افزودن مهارت جدید
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    if (!name || !categoryId) {
      return res.status(400).json({ success: false, message: 'نام مهارت و شاخه الزامی است.' });
    }
    const skill = await Skill.create({ name, categoryId, description });
    res.status(201).json({ success: true, data: skill, message: 'مهارت اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/:id — حذف مهارت
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'مهارت حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
