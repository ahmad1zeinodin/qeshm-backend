import express from 'express';
import Skill from '../models/Skill.js';
import Category from '../models/Category.js';

const router = express.Router();

// دریافت همه مهارت‌ها
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).populate('categoryId', 'name').sort({ name: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
