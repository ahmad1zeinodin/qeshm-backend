import express from 'express';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) wallet = await Wallet.create({ userId: req.user.id });
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { wallet, transactions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ success: false, message: 'کیف پول یافت نشد.' });

    if (wallet.balance - amount < wallet.minWithdrawalLimit) {
      return res.status(400).json({ success: false, message: 'مبلغ درخواستی با توجه به کف حساب مجاز نیست.' });
    }

    const reference = \`WTH-\${Date.now()}-\${req.user.id}\`;
    await Transaction.create({
      userId: req.user.id,
      amount,
      type: 'withdrawal',
      reference,
      description: 'درخواست برداشت وجه',
      status: 'pending',
    });

    res.json({ success: true, message: 'درخواست برداشت ثبت شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
