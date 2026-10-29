import express from 'express';
import Skill from '../models/Skill.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' });
  next();
};

// دریافت همه مهارت‌ها
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).populate('categoryId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// افزودن مهارت جدید (فقط ادمین)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) return res.status(400).json({ success: false, message: 'نام مهارت و دسته‌بندی الزامی است.' });
    const skill = await Skill.create({ name, categoryId });
    res.status(201).json({ success: true, data: skill, message: 'مهارت اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// حذف مهارت (فقط ادمین)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'مهارت حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
