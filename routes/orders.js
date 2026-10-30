import express from 'express';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ثبت سفارش جدید
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { serviceId, address, description, paymentMethod } = req.body;
    if (!serviceId || !address) return res.status(400).json({ success: false, message: 'اطلاعات ناقص است.' });

    const service = await Service.findById(serviceId).populate('categoryId');
    if (!service) return res.status(404).json({ success: false, message: 'خدمت یافت نشد.' });

    const category = service.categoryId;
    const depositAmount = category.depositAmount || 0;
    const taxAmount = category.showTax ? (service.price * category.taxPercent) / 100 : 0;
    const totalPaid = depositAmount + taxAmount;
    const remainingAmount = service.price - depositAmount;

    if (paymentMethod === 'wallet') {
      let wallet = await Wallet.findOne({ userId: req.user.id });
      if (!wallet || wallet.balance < totalPaid) {
        return res.status(400).json({ success: false, message: 'موجودی کیف پول کافی نیست.' });
      }
      wallet.balance -= totalPaid;
      wallet.transactions.push({ type: 'payment', amount: totalPaid, description: 'پرداخت بیعانه سفارش' });
      await wallet.save();
    }

    const order = await Order.create({
      clientId: req.user.id,
      workerId: service.workerId,
      serviceId: service._id,
      categoryId: category._id,
      serviceTitle: service.title,
      description: description || service.description,
      address,
      basePrice: service.price,
      depositAmount,
      taxAmount,
      totalPaid,
      remainingAmount,
      paymentMethod: paymentMethod || 'online',
      status: 'pending'
    });

    if (depositAmount > 0) {
      await Transaction.create({ userId: req.user.id, orderId: order._id, type: 'deposit', amount: depositAmount, description: 'بیعانه سفارش' });
    }

    if (taxAmount > 0) {
      await Transaction.create({ userId: req.user.id, orderId: order._id, type: 'commission', amount: taxAmount, description: 'مالیات بر ارزش افزوده' });
    }

    // ارسال پیام به مشتری
    await Notification.create({
      userId: req.user.id,
      title: 'سفارش ثبت شد',
      message: `سفارش شما برای «${service.title}» با موفقیت ثبت شد و در حال بررسی است.`,
      type: 'order'
    });

    res.status(201).json({ success: true, data: order, message: 'سفارش ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت سفارشات
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') query = { clientId: req.user.id };
    if (req.user.role === 'worker') query = { workerId: req.user.id };
    const orders = await Order.find(query).populate('clientId', 'name phone').populate('workerId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تغییر وضعیت سفارش
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'سفارش یافت نشد.' });

    // اگر سفیر کنسل کرد، بیعانه به کیف پول مشتری برمی‌گردد
    if (status === 'cancelled' && order.paymentMethod) {
      let wallet = await Wallet.findOne({ userId: order.clientId });
      if (!wallet) wallet = await Wallet.create({ userId: order.clientId });
      
      wallet.balance += order.totalPaid;
      wallet.transactions.push({ type: 'refund', amount: order.totalPaid, description: 'عودت وجه به دلیل کنسلی سفیر' });
      await wallet.save();

      // ارسال پیام به مشتری
      await Notification.create({
        userId: order.clientId,
        title: 'عودت وجه',
        message: `سفیر سفارش «${order.serviceTitle}» را کنسل کرد. مبلغ ${order.totalPaid.toLocaleString()} تومان به کیف پول شما بازگشت.`,
        type: 'wallet'
      });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;