import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET همه دسته‌بندی‌ها به صورت درختی (والد + فرزندان)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).lean();
    const roots = categories.filter(c => !c.parentId);
    const tree = roots.map(root => ({
      ...root,
      children: categories.filter(c => c.parentId && c.parentId.toString() === root._id.toString())
    }));
    res.json({ success: true, data: tree });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST ثبت دسته‌بندی جدید (با تعیین والد)
router.post('/', async (req, res) => {
  try {
    const { name, slug, icon, group, parentId } = req.body;
    const category = await Category.create({ name, slug, icon, group, parentId: parentId || null });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE حذف دسته‌بندی
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'دسته‌بندی حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
