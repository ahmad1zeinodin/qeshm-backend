import express from 'express';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ثبت سفارش جدید (توسط مشتری)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { workerId, serviceTitle, description, address, depositAmount } = req.body;
    if (!serviceTitle || !address || !depositAmount) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است.' });
    }
    const order = await Order.create({
      clientId: req.user.id,
      workerId,
      serviceTitle,
      description,
      address,
      depositAmount,
      status: 'pending'
    });
    res.status(201).json({ success: true, data: order, message: 'سفارش ثبت شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// دریافت سفارشات (بر اساس نقش)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') query = { clientId: req.user.id };
    if (req.user.role === 'worker') query = { workerId: req.user.id };
    // ادمین همه را می‌بیند
    const orders = await Order.find(query).populate('clientId', 'name phone').populate('workerId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// تغییر وضعیت سفارش (توسط سفیر)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'سفارش یافت نشد.' });
    
    // سفیر فقط می‌تواند سفارش خودش را تغییر دهد
    if (req.user.role === 'worker' && order.workerId?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    res.json({ success: true, data: order, message: 'وضعیت سفارش تغییر کرد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ارجاع مجدد سفارش (فقط ادمین)
router.put('/:id/reassign', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' });
    
    const { newWorkerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'سفارش یافت نشد.' });

    order.workerId = newWorkerId;
    order.status = 'accepted'; // مستقیم قبول شده
    order.reassignedTo = newWorkerId;
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({ success: true, data: order, message: 'سفارش به سفیر جدید ارجاع شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
