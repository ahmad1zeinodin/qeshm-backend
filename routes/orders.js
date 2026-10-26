import express from 'express';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// POST /api/orders — ثبت سفارش جدید (توسط مشتری)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { vendorId, vendorName, vendorType, items, totalPrice, deliveryFee, finalAmount, address } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'سبد خرید خالی است.' });
    }
    const order = await Order.create({
      userId: req.user.id,
      vendorId,
      vendorName,
      vendorType,
      items,
      totalPrice,
      deliveryFee: deliveryFee || 0,
      finalAmount,
      address,
    });
    res.status(201).json({ success: true, data: order, message: 'سفارش با موفقیت ثبت شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders — دریافت سفارشات (برای مشتری: فقط خودش، برای ادمین: همه)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.userId = req.user.id;
    }
    const orders = await Order.find(filter).populate('userId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status — تغییر وضعیت سفارش (فقط ادمین)
router.put('/:id/status', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'سفارش یافت نشد.' });
    res.json({ success: true, data: order, message: 'وضعیت سفارش تغییر کرد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
