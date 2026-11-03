import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت محتوای سفیر
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('services menu products news mainField');
    if (!user) return res.status(404).json({ success: false, message: 'کاربر پیدا نشد.' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن محتوا
router.post('/me', authenticateToken, async (req, res) => {
  try {
    const { type, item } = req.body; // type: 'menu', 'services', 'products', 'news'
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'کاربر پیدا نشد.' });

    if (!user[type]) user[type] = [];
    user[type].push({ ...item, isActive: true, createdAt: new Date() });
    await user.save();

    res.json({ success: true, data: user[type], message: 'محتوا اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ✅ ویرایش محتوا (برای ویرایش خدمات و تغییر وضعیت فعال/غیرفعال)
router.put('/me/:type/:itemId', authenticateToken, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const updates = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'کاربر پیدا نشد.' });

    // پیدا کردن آیتم مورد نظر
    const item = user[type].id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'آیتم پیدا نشد.' });

    // اعمال تغییرات
    if (updates.title) item.title = updates.title;
    if (updates.description) item.description = updates.description;
    if (updates.price !== undefined) item.price = Number(updates.price);
    if (updates.image) item.image = updates.image;
    if (updates.isActive !== undefined) item.isActive = updates.isActive;
    if (updates.category) item.category = updates.category;

    await user.save();
    res.json({ success: true, data: item, message: 'تغییرات ذخیره شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف محتوا
router.delete('/me/:type/:itemId', authenticateToken, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'کاربر پیدا نشد.' });

    user[type] = user[type].filter(item => item._id.toString() !== itemId);
    await user.save();
    res.json({ success: true, message: 'محتوا حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;