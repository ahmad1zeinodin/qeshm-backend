import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { 
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); 
  next(); 
};

// دریافت آمار
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'client' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalOrders = await Order.countDocuments();
    const onlineWorkers = await User.countDocuments({ role: 'worker', isOnline: true });
    res.json({ success: true, data: { totalUsers, totalWorkers, totalOrders, onlineWorkers } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت لیست سفیران
router.get('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-passwordHash');
    res.json({ success: true, data: workers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت سفیر جدید
router.post('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, nationalId, emergencyPhone, sheba, adminBadgeText, mainField, categoryId, maritalStatus, documents } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ success: false, message: 'نام، ایمیل، تلفن و رمز عبور الزامی است.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'این ایمیل قبلاً ثبت شده است.' });
    const passwordHash = await bcrypt.hash(password, 10);
    const worker = await User.create({ name, email, phone, passwordHash, nationalId, emergencyPhone, sheba, adminBadgeText, mainField, categoryId, maritalStatus, documents, role: 'worker' });
    res.status(201).json({ success: true, data: worker, message: 'سفیر با موفقیت ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ✅ ویرایش سفیر
router.put('/workers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, nationalId, emergencyPhone, sheba, adminBadgeText, mainField, categoryId, maritalStatus } = req.body;
    const worker = await User.findByIdAndUpdate(req.params.id, { name, email, phone, nationalId, emergencyPhone, sheba, adminBadgeText, mainField, categoryId, maritalStatus }, { new: true }).select('-passwordHash');
    if (!worker) return res.status(404).json({ success: false, message: 'سفیر پیدا نشد.' });
    res.json({ success: true, data: worker, message: 'اطلاعات سفیر ویرایش شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ✅ حذف سفیر
router.delete('/workers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'سفیر حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت کاربران (مشتریان)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }).select('-passwordHash');
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// جستجوی کاربر با شماره تلفن
router.get('/users/search', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'شماره تلفن الزامی است.' });
    const user = await User.findOne({ phone }).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'کاربری با این شماره یافت نشد.' });
    const orders = await Order.find({ clientId: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { user, orders } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// دریافت سفارشات
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { mainField, status, isCancelled } = req.query;
    let query = {};
    if (status) query.status = status;
    if (isCancelled === 'true') query.status = 'cancelled';
    const orders = await Order.find(query).populate('clientId', 'name').populate('workerId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;