import express from 'express';
import Transaction from '../models/Transaction.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import RefundRequest from '../models/RefundRequest.js';
import FinancialSetting from '../models/FinancialSetting.js';
import ActivityLog from '../models/ActivityLog.js';
import Wallet from '../models/Wallet.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// ==================== خلاصه وضعیت ====================
router.get('/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalDeposits = transactions.filter(t => t.type === 'deposit' || t.type === 'earning').reduce((sum, t) => sum + t.amount, 0);
    const totalPayouts = transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalDeposits - totalPayouts;
    res.json({ success: true, data: { totalDeposits, totalPayouts, totalBalance } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== گردش حساب ====================
router.get('/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type, from, to } = req.query;
    let query = {};
    if (type) query.type = type;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const transactions = await Transaction.find(query).populate('userId', 'name').populate('orderId', 'serviceTitle').sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== درخواست‌های برداشت ====================
router.get('/withdrawals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find().populate('workerId', 'name phone').sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

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
      if (wallet && wallet.availableBalance >= request.amount) {
        wallet.availableBalance -= request.amount;
        wallet.transactions.push({ type: 'withdraw', amount: request.amount, description: 'برداشت تایید شده' });
        await wallet.save();
        await Transaction.create({ userId: request.workerId, type: 'payout', amount: request.amount, description: 'برداشت از کیف پول' });
      }
    }

    await ActivityLog.create({ adminId: req.user.id, action: `تغییر وضعیت برداشت به ${status}`, amount: request.amount, description: adminNote || '' });
    res.json({ success: true, message: 'وضعیت درخواست تغییر کرد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/withdrawals', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'worker') return res.status(403).json({ success: false, message: 'فقط سفیران.' });
    const { amount, sheba } = req.body;
    const request = await WithdrawalRequest.create({ workerId: req.user.id, amount, sheba });
    res.status(201).json({ success: true, data: request, message: 'درخواست ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== عودت وجه ====================
router.get('/refunds', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const refunds = await RefundRequest.find().populate('clientId', 'name phone').populate('orderId', 'serviceTitle').sort({ createdAt: -1 });
    res.json({ success: true, data: refunds });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/refunds/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const refund = await RefundRequest.findById(req.params.id);
    if (!refund) return res.status(404).json({ success: false, message: 'درخواست یافت نشد.' });
    refund.status = status;
    refund.adminNote = adminNote || '';
    await refund.save();

    if (status === 'approved') {
      const wallet = await Wallet.findOne({ userId: refund.clientId }) || await Wallet.create({ userId: refund.clientId });
      wallet.availableBalance += refund.amount;
      wallet.transactions.push({ type: 'deposit', amount: refund.amount, description: 'عودت وجه' });
      await wallet.save();
      await Transaction.create({ userId: refund.clientId, orderId: refund.orderId, type: 'refund', amount: refund.amount, description: 'عودت وجه' });
    }
    await ActivityLog.create({ adminId: req.user.id, action: `تغییر وضعیت عودت به ${status}`, amount: refund.amount, description: adminNote || '' });
    res.json({ success: true, message: 'وضعیت عودت تغییر کرد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== کیف پول‌ها ====================
router.get('/wallets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const wallets = await Wallet.find().populate('userId', 'name phone role').sort({ createdAt: -1 });
    res.json({ success: true, data: wallets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/wallets/:id/charge', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'مبلغ نامعتبر.' });
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(404).json({ success: false, message: 'کیف پول یافت نشد.' });
    wallet.availableBalance += amount;
    wallet.transactions.push({ type: 'deposit', amount, description: 'شارژ دستی توسط ادمین' });
    await wallet.save();
    await Transaction.create({ userId: wallet.userId, type: 'deposit', amount, description: 'شارژ دستی توسط ادمین' });
    await ActivityLog.create({ adminId: req.user.id, action: 'شارژ دستی کیف پول', amount, description: `کیف پول ${wallet.userId}` });
    res.json({ success: true, message: 'کیف پول شارژ شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/wallets/:id/deduct', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'مبلغ نامعتبر.' });
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(404).json({ success: false, message: 'کیف پول یافت نشد.' });
    if (wallet.availableBalance < amount) return res.status(400).json({ success: false, message: 'موجودی کافی نیست.' });
    wallet.availableBalance -= amount;
    wallet.transactions.push({ type: 'withdraw', amount, description: 'کسر دستی توسط ادمین' });
    await wallet.save();
    await Transaction.create({ userId: wallet.userId, type: 'payout', amount, description: 'کسر دستی توسط ادمین' });
    await ActivityLog.create({ adminId: req.user.id, action: 'کسر دستی کیف پول', amount, description: `کیف پول ${wallet.userId}` });
    res.json({ success: true, message: 'مبلغ از کیف پول کسر شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== تنظیمات مالی ====================
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await FinancialSetting.find();
    res.json({ success: true, data: settings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await FinancialSetting.findOneAndUpdate({ key }, { value, updatedAt: Date.now() }, { upsert: true });
    }
    res.json({ success: true, message: 'تنظیمات ذخیره شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== لاگ فعالیت‌ها ====================
router.get('/activity-logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate('adminId', 'name').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== گزارش‌ها ====================
router.get('/reports/revenue', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const revenue = await Transaction.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, type: { $in: ['deposit', 'commission'] } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: revenue });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
