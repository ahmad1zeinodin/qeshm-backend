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

// ۱. دریافت آمار کلی داشبورد
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'client' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalOrders = await Order.countDocuments();
    const onlineWorkers = await User.countDocuments({ role: 'worker', isOnline: true });
    res.json({ success: true, data: { totalUsers, totalWorkers, totalOrders, onlineWorkers } });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۲. دریافت لیست سفیران (فقط آنلاین‌ها)
router.get('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isOnline: true }).select('-passwordHash');
    res.json({ success: true, data: workers });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۳. ثبت سفیر جدید توسط ادمین (همراه با مدارک و اطلاعات تکمیلی)
router.post('/workers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      name, email, phone, password, nationalId, emergencyPhone, sheba, 
      adminBadgeText, mainField, categoryId, maritalStatus, documents 
    } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'نام، ایمیل، تلفن و رمز عبور الزامی است.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'این ایمیل قبلاً ثبت شده است.' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const worker = await User.create({
      name, email, phone, passwordHash, nationalId, emergencyPhone, sheba, 
      adminBadgeText, mainField, categoryId, maritalStatus, documents,
      role: 'worker'
    });
    
    res.status(201).json({ success: true, data: worker, message: 'سفیر با موفقیت ثبت شد.' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۴. دریافت لیست کاربران (مشتریان)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }).select('-passwordHash');
    res.json({ success: true, data: users });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// ۵. دریافت لیست سفارشات (با قابلیت فیلتر)
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { mainField, status, isCancelled } = req.query;
    let query = {};
    
    // فیلتر بر اساس وضعیت
    if (status) query.status = status;
    
    // فیلتر بر اساس کنسلی
    if (isCancelled === 'true') query.status = 'cancelled';

    // اگر فیلد اصلی انتخاب شده باشد (در اینجا فرض بر این است که سفارش به فیلد اصلی متصل است)
    // if (mainField) query.mainField = mainField;

    const orders = await Order.find(query)
      .populate('clientId', 'name')
      .populate('workerId', 'name')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: orders });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

export default router;