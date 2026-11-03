import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { 
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); 
  next(); 
};

// ۱. گزارش ارزش افزوده (VAT)
router.get('/vat-reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ taxAmount: { $gt: 0 } })
      .populate('workerId', 'name')
      .sort({ createdAt: -1 });
    
    const totalTax = orders.reduce((sum, o) => sum + o.taxAmount, 0);
    res.json({ success: true, data: { orders, totalTax } });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۲. خلاصه وضعیت مالی
router.get('/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'completed' });
    const totalDeposits = orders.reduce((sum, o) => sum + o.depositAmount, 0);
    const totalPayouts = orders.reduce((sum, o) => sum + o.workerShare, 0);
    const totalBalance = orders.reduce((sum, o) => sum + o.commissionAmount, 0);
    res.json({ success: true, data: { totalDeposits, totalPayouts, totalBalance } });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۳. لیست تراکنش‌ها (گردش حساب)
router.get('/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: { $in: ['completed', 'accepted'] } })
      .populate('clientId', 'name')
      .sort({ createdAt: -1 });
      
    const transactions = orders.map(o => ({
      _id: o._id,
      userId: o.clientId,
      type: 'payment',
      amount: o.totalPrice,
      description: 'پرداخت سفارش',
      createdAt: o.createdAt
    }));
    res.json({ success: true, data: transactions });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۴. درخواست‌های برداشت
router.get('/withdrawals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const withdrawals = await User.find({ 'withdrawals.status': 'pending' }).select('name withdrawals');
    
    const list = withdrawals.flatMap(w => 
      w.withdrawals.filter(wd => wd.status === 'pending').map(wd => ({
        _id: wd._id,
        workerId: { name: w.name },
        amount: wd.amount,
        sheba: wd.sheba,
        status: wd.status
      }))
    );
    res.json({ success: true, data: list });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۵. تغییر وضعیت درخواست برداشت
router.put('/withdrawals/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOne({ 'withdrawals._id': req.params.id });
    if (!user) return res.status(404).json({ success: false, message: 'درخواست پیدا نشد.' });
    
    const withdrawal = user.withdrawals.id(req.params.id);
    if (withdrawal) {
      withdrawal.status = status;
      await user.save();
    }
    res.json({ success: true, message: 'وضعیت تغییر کرد.' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

export default router;