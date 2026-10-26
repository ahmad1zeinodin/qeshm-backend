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

    // --- منطق مالی ---
    const Category = (await import('../models/Category.js')).default;
    const Wallet = (await import('../models/Wallet.js')).default;
    const Transaction = (await import('../models/Transaction.js')).default;

    const category = await Category.findOne({ slug: vendorType });
    if (category) {
      const vatPercent = category.vatEnabled ? category.vatPercent : 0;
      const commissionPercent = category.commissionPercent || 0;
      const commissionFixed = category.commissionFixed || 0;

      const vatAmount = (finalAmount * vatPercent) / 100;
      const amountWithoutVat = finalAmount - vatAmount;
      const commissionAmount = (amountWithoutVat * commissionPercent) / 100 + commissionFixed;
      const vendorShare = amountWithoutVat - commissionAmount;

      // واریز سهم سفیر به کیف پول
      if (vendorId) {
        let wallet = await Wallet.findOne({ userId: vendorId });
        
        wallet.balance += vendorShare;
        await wallet.save();

        // ثبت تراکنش
        const reference = 'DEP-' + Date.now() + '-' + vendorId;
        await Transaction.create({
          userId: vendorId,
          orderId: order._id,
          amount: vendorShare,
          type: 'deposit',
          reference,
          description: 'سهم از سفارش ' + order._id,
          status: 'success',
        });
      }
    }
    // --- پایان منطق مالی ---

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
