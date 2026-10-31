import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const requireAdmin = (req, res, next) => { 
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز.' }); 
  next(); 
};

// دریافت لیست همکاران
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const employees = await User.find({ role: { $in: ['support', 'employee'] } }).select('-passwordHash');
    res.json({ success: true, data: employees });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ثبت همکار جدید
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, personnelNumber, jobTitle, adminPermissions, role, maritalStatus, emergencyPhone, nationalId, documents } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'نام، ایمیل و رمز عبور الزامی است.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'این ایمیل قبلاً ثبت شده است.' });
    const passwordHash = await bcrypt.hash(password, 10);
    const employee = await User.create({ name, email, phone, passwordHash, personnelNumber, jobTitle, adminPermissions: adminPermissions || {}, role: role || 'employee', maritalStatus, emergencyPhone, nationalId, documents });
    res.status(201).json({ success: true, data: employee, message: 'همکار ثبت شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ✅ ویرایش اطلاعات همکار
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, personnelNumber, jobTitle, role, maritalStatus, emergencyPhone, nationalId } = req.body;
    const employee = await User.findByIdAndUpdate(req.params.id, { name, email, phone, personnelNumber, jobTitle, role, maritalStatus, emergencyPhone, nationalId }, { new: true }).select('-passwordHash');
    if (!employee) return res.status(404).json({ success: false, message: 'همکار پیدا نشد.' });
    res.json({ success: true, data: employee, message: 'اطلاعات همکار ویرایش شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ویرایش دسترسی‌ها
router.put('/:id/permissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { adminPermissions } = req.body;
    const employee = await User.findByIdAndUpdate(req.params.id, { adminPermissions }, { new: true }).select('-passwordHash');
    if (!employee) return res.status(404).json({ success: false, message: 'همکار پیدا نشد.' });
    res.json({ success: true, data: employee, message: 'دسترسی‌ها به‌روزرسانی شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// حذف همکار
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'همکار حذف شد.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;