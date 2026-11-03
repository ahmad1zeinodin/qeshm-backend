import express from 'express';
import Menu from '../models/Menu.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// دریافت تمام منوها (به صورت درختی)
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find({ isActive: true }).sort({ order: 1 });
    // ساختار درختی
    const buildTree = (parentId = null) => {
      return menus
        .filter(m => String(m.parentId) === String(parentId))
        .map(m => ({
          ...m.toObject(),
          children: buildTree(m._id)
        }));
    };
    res.json({ success: true, data: buildTree() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن منوی جدید (فقط ادمین)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, icon, path, parentId, order } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'عنوان منو الزامی است.' });
    const menu = await Menu.create({ title, icon, path, parentId: parentId || null, order: order || 0 });
    res.status(201).json({ success: true, data: menu, message: 'منو اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف منو (فقط ادمین)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'منو حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
