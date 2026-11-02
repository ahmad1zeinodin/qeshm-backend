import express from 'express';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// دریافت خدمات یک سفیر (عمومی)
router.get('/worker/:workerId', async (req, res) => {
  try {
    const services = await Service.find({ workerId: req.params.workerId });
    res.json({ success: true, data: services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت خدمات خودِ سفیرِ لاگین‌شده
router.get('/worker/me', authenticateToken, async (req, res) => {
  try {
    const services = await Service.find({ workerId: req.user.id });
    res.json({ success: true, data: services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// افزودن خدمت جدید
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, image, categoryId } = req.body;
    if (!title || !price) return res.status(400).json({ success: false, message: 'نام و قیمت الزامی است.' });
    const service = await Service.create({
      workerId: req.user.id,
      title, description, price, image, categoryId,
      isActive: true
    });
    res.status(201).json({ success: true, data: service, message: 'خدمت اضافه شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ویرایش خدمت
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, workerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ success: false, message: 'خدمت پیدا نشد.' });
    res.json({ success: true, data: service });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف خدمت
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, workerId: req.user.id });
    if (!service) return res.status(404).json({ success: false, message: 'خدمت پیدا نشد.' });
    res.json({ success: true, message: 'خدمت حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;