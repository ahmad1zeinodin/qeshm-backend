import express from 'express';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ثبت سفارش جدید
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { workerId, serviceTitle, description, address, depositAmount, totalAmount } = req.body;
    if (!serviceTitle || !address) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است.' });
    }

    const order = await Order.create({
      clientId: req.user.id,
      workerId,
      serviceTitle,
      description,
      address,
      depositAmount: depositAmount || 0,
      totalAmount: totalAmount || 0,
      status: 'pending'
    });

    // برای بخش خدمات: بیعانه به حساب پلتفرم می‌رود (کمیسیون)
    if (depositAmount > 0) {
      await Transaction.create({
        userId: req.user.id,
        orderId: order._id,
        type: 'deposit',
        amount: depositAmount,
        description: 'بیعانه سفارش خدمات'
      });
    }

    // برای بخش فروشگاه/رستوران: مبلغ کل به کیف پول سفیر واریز می‌شود
    if (totalAmount > 0 && workerId) {
      let wallet = await Wallet.findOne({ userId: workerId });
      if (!wallet) wallet = await Wallet.create({ userId: workerId });
      
      wallet.availableBalance += totalAmount;
      wallet.transactions.push({ type: 'earning', amount: totalAmount, description: 'درآمد سفارش' });
      await wallet.save();

      await Transaction.create({
        userId: workerId,
        orderId: order._id,
        type: 'earning',
        amount: totalAmount,
        description: 'واریز به کیف پول سفیر'
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