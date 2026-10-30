import express from 'express';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
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

    // بررسی پرداخت از کیف پول
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

    // ثبت تراکنش بیعانه (برای پلتفرم)
    if (depositAmount > 0) {
      await Transaction.create({
        userId: req.user.id,
        orderId: order._id,
        type: 'deposit',
        amount: depositAmount,
        description: 'بیعانه سفارش'
      });
    }

    // ثبت تراکنش مالیات (برای پلتفرم)
    if (taxAmount > 0) {
      await Transaction.create({
        userId: req.user.id,
        orderId: order._id,
        type: 'commission',
        amount: taxAmount,
        description: 'مالیات بر ارزش افزوده'
      });
    }

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
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status, updatedAt: Date.now() }, { new: true });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;