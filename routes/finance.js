import express from 'express';
import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// POST /api/finance/process — پردازش مالی یک سفارش (توسط ادمین یا سیستم)
router.post('/process', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { orderId, paymentMethod, commissionType, commissionValue } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'سفارش یافت نشد' });
    if (order.status === 'paid') return res.status(400).json({ success: false, message: 'این سفارش قبلاً پرداخت شده است' });

    // محاسبه کمیسیون
    let platformCommission = 0;
    if (commissionType === 'percentage') {
      platformCommission = (order.finalAmount * commissionValue) / 100;
    } else if (commissionType === 'fixed') {
      platformCommission = commissionValue;
    } else if (commissionType === 'both') {
      platformCommission = (order.finalAmount * commissionValue.percent) / 100 + commissionValue.fixed;
    }

    const vendorShare = order.finalAmount - platformCommission;

    // ثبت تراکنش و سه سند
    const transaction = await Transaction.create({
      orderId: order._id,
      customerId: order.userId,
      vendorId: order.vendorId,
      paymentMethod,
      totalAmount: order.finalAmount,
      platformCommission,
      vendorShare,
      customerReceipt: `رسید پرداخت مشتری - مبلغ: ${order.finalAmount.toLocaleString()} تومان`,
      platformReceipt: `رسید دریافت مدیر - کمیسیون: ${platformCommission.toLocaleString()} تومان`,
      vendorReceipt: `رسید دریافت فروشنده - مبلغ: ${vendorShare.toLocaleString()} تومان`,
      status: 'success',
    });

    // به‌روزرسانی وضعیت سفارش
    order.status = 'paid';
    await order.save();

    // به‌روزرسانی کیف پول فروشنده (اگر مدل کاربر باشد)
    if (order.vendorType === 'worker') {
      await User.findByIdAndUpdate(order.vendorId, { $inc: { walletBalance: vendorShare } });
    }

    res.json({ success: true, data: transaction, message: 'پردازش مالی با موفقیت انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
