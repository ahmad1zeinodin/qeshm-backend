import express from 'express';
import Wallet from '../models/Wallet.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// دریافت کیف پول کاربر (موجودی و تراکنش‌ها)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) wallet = await Wallet.create({ userId: req.user.id });
    res.json({ success: true, data: wallet });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت لیست درخواست‌های برداشت (برای ادمین)
router.get('/withdrawals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find().populate('workerId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت درخواست برداشت (توسط مشتری یا سفیر)
router.post('/withdrawals', authenticateToken, async (req, res) => {
  try {
    const { amount, sheba } = req.body;
    if (!amount || !sheba) return res.status(400).json({ success: false, message: 'مبلغ و شبا الزامی است.' });

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'موجودی کافی نیست.' });
    }

    const request = await WithdrawalRequest.create({ workerId: req.user.id, amount, sheba });
    res.status(201).json({ success: true, data: request, message: 'درخواست برداشت ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تایید یا رد درخواست برداشت (توسط ادمین)
router.put('/withdrawals/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const request = await WithdrawalRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'درخواست یافت نشد.' });

    request.status = status;
    request.adminNote = adminNote || '';
    request.updatedAt = Date.now();
    await request.save();

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

export default router;