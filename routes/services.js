import express from 'express';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت خدمات خود سفیر
router.get('/worker/me', authenticateToken, async (req, res) => {
  try {
    const services = await Service.find({ workerId: req.user.id, isActive: true }).populate('categoryId', 'name');
    res.json({ success: true, data: services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت خدمات یک سفیر (برای نمایش به مشتری)
router.get('/worker/:workerId', async (req, res) => {
  try {
    const services = await Service.find({ workerId: req.params.workerId, isActive: true }).populate('categoryId', 'name depositAmount taxPercent showTax');
    res.json({ success: true, data: services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن خدمت جدید توسط سفیر
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'worker' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'فقط سفیران.' });
    }
    const { title, description, price, categoryId } = req.body;
    if (!title || !price || !categoryId) return res.status(400).json({ success: false, message: 'عنوان، قیمت و دسته الزامی است.' });

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ success: false, message: 'دسته‌بندی یافت نشد.' });

    const service = await Service.create({ workerId: req.user.id, title, description, price, categoryId });
    res.status(201).json({ success: true, data: service, message: 'خدمت جدید اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف خدمت
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'خدمت یافت نشد.' });
    if (service.workerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' });
    }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'خدمت حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;