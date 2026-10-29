import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Ticket from '../models/Ticket.js';
import Settings from '../models/Settings.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); next(); };

// آمار داشبورد
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'client' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalOrders = await Order.countDocuments();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 }, income: { $sum: "$depositAmount" } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: { totalUsers, totalWorkers, totalOrders, chartData: stats } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// مدیریت کاربران و سفیران
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try { const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }); res.json({ success: true, data: users }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try { const workers = await User.find({ role: 'worker' }).select('-passwordHash').sort({ createdAt: -1 }); res.json({ success: true, data: workers }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, nationalId, emergencyPhone, sheba, adminBadgeText } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'ایمیل تکراری است.' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const worker = await User.create({ name, email, phone, passwordHash, nationalId, emergencyPhone, sheba, adminBadgeText, role: 'worker', isVerified: true });
    res.status(201).json({ success: true, data: worker, message: 'سفیر ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/workers/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try { await User.findByIdAndUpdate(req.params.id, { isSuspended: req.body.isSuspended }); res.json({ success: true }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// سفارشات
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try { const orders = await Order.find().populate('clientId', 'name phone').populate('workerId', 'name phone').sort({ createdAt: -1 }); res.json({ success: true, data: orders }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try { await Order.findByIdAndUpdate(req.params.id, { status: req.body.status, updatedAt: Date.now() }); res.json({ success: true }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تیکت‌ها (دریافت و پاسخ)
router.get('/tickets', authenticateToken, requireAdmin, async (req, res) => {
  try { const tickets = await Ticket.find().populate('userId', 'name phone').sort({ createdAt: -1 }); res.json({ success: true, data: tickets }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/tickets/:id/reply', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.messages.push({ senderId: req.user.id, text: req.body.text });
    ticket.status = 'answered';
    await ticket.save();
    res.json({ success: true, data: ticket, message: 'پاسخ ارسال شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// تنظیمات
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try { const settings = await Settings.find(); const data = {}; settings.forEach(s => { data[s.key] = s.value; }); res.json({ success: true, data }); } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await Settings.findOneAndUpdate({ key }, { value, updatedAt: Date.now() }, { upsert: true });
    }
    res.json({ success: true, message: 'تنظیمات ذخیره شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
