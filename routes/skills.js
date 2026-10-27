import express from 'express';
import Skill from '../models/Skill.js';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// روت موقت برای پاکسازی کامل شاخه‌ها و مهارت‌های قدیمی
router.delete('/clear-all-data', async (req, res) => {
  try {
    await Skill.deleteMany({});
    await Category.deleteMany({});
    res.json({ success: true, message: 'تمامی شاخه‌ها و مهارت‌های قدیمی با موفقیت پاک شدند.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== API های شاخه‌ها (Category) ====================

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

router.delete('/categories/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'شاخه حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== API های مهارت‌ها (Skill) ====================

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).populate('categoryId', 'name').sort({ name: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'مهارت حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
