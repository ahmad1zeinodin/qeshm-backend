import express from 'express';
import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

router.post('/process', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { orderId, paymentMethod, commissionType, commissionValue } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'سفارش یافت نشد' });
    
    let platformCommission = 0;
    if (commissionType === 'percentage') {
      platformCommission = (order.finalAmount * commissionValue) / 100;
    } else if (commissionType === 'fixed') {
      platformCommission = commissionValue;
    } else if (commissionType === 'both') {
      platformCommission = (order.finalAmount * commissionValue.percent) / 100 + commissionValue.fixed;
    }
    
    const vendorShare = order.finalAmount - platformCommission;
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
    
    res.json({ success: true, data: transaction, message: 'پردازش مالی انجام شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

// GET /api/finance/summary — گزارش لحظه‌ای بدهی/طلب و کمیسیون
router.get('/summary', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { vendorName, vendorType, status } = req.query;
    
    // ساخت فیلتر بر اساس پارامترهای ورودی
    let matchFilter = {};
    if (vendorName) matchFilter.vendorId = { $regex: vendorName, $options: 'i' };
    if (status) matchFilter.status = status;

    // محاسبه جمع کل کمیسیون (درآمد پلتفرم)
    const totalCommission = await Transaction.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, total: { $sum: '$platformCommission' } } }
    ]);

    // محاسبه بدهی به هر فروشنده (جمع سهم فروشنده‌ها)
    const vendorDebts = await Transaction.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$vendorId', totalShare: { $sum: '$vendorShare' } } },
      { $sort: { totalShare: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalPlatformIncome: totalCommission[0]?.total || 0,
        totalVendorDebts: vendorDebts,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
