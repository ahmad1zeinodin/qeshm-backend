import express from 'express';
import Transaction from '../models/Transaction.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import Wallet from '../models/Wallet.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// ادمین: مشاهده همه تراکنش‌ها
router.get('/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ادمین: مشاهده درخواست‌های برداشت
router.get('/withdrawals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find().populate('workerId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ادمین: تایید یا رد درخواست برداشت
router.put('/withdrawals/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const request = await WithdrawalRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'درخواست یافت نشد.' });
    
    request.status = status;
    request.adminNote = adminNote || '';
    request.updatedAt = Date.now();
    await request.save();

    // اگر تایید شد، از موجودی کیف پول سفیر کم میشه
    if (status === 'approved') {
      const wallet = await Wallet.findOne({ userId: request.workerId });
      if (wallet && wallet.balance >= request.amount) {
        wallet.balance -= request.amount;
        wallet.transactions.push({ type: 'withdraw', amount: request.amount, description: 'برداشت تایید شده' });
        await wallet.save();
      }
    }
    res.json({ success: true, message: 'وضعیت درخواست تغییر کرد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// سفیر: ثبت درخواست برداشت
router.post('/withdrawals', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'worker') return res.status(403).json({ success: false, message: 'فقط سفیران.' });
    const { amount, sheba } = req.body;
    const request = await WithdrawalRequest.create({ workerId: req.user.id, amount, sheba });
    res.status(201).json({ success: true, data: request, message: 'درخواست ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
