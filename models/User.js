import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker', 'admin', 'support', 'employee'], default: 'client' },
  
  // اطلاعات پایه پروفایل
  profilePhoto: { type: String, default: '' },
  bio: { type: String, default: '' },
  nationalId: { type: String, default: '' },
  sheba: { type: String, default: '' },
  emergencyPhone: { type: String, default: '' },
  adminBadgeText: { type: String, default: '' },
  maritalStatus: { type: String, enum: ['single', 'married', ''], default: '' }, // وضعیت تاهل
  
  // مدارک و مستندات (آپلود شده)
  documents: {
    nationalCardPhoto: { type: String, default: '' }, // عکس کارت ملی
    birthCertificatePhoto: { type: String, default: '' }, // عکس شناسنامه
    businessLicense: { type: String, default: '' }, // جواز کسب (برای اصناف)
    skillCertificate: { type: String, default: '' }, // مدارک تخصصی (برای خدمات)
  },

  // احراز هویت (سامانه هدا)
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'none'], default: 'none' },
  verificationTrackId: { type: String, default: '' }, // کد رهگیری هدا
  
  // فیلدها و دسته‌بندی
  mainField: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  
  // وضعیت آنلاین بودن
  isOnline: { type: Boolean, default: false },
  
  // سیستم دسترسی‌ها (برای همکاران)
  adminPermissions: {
    dashboard: { type: Boolean, default: false },
    mainFields: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    workers: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    finance: { type: Boolean, default: false },
    support: { type: Boolean, default: false },
    news: { type: Boolean, default: false },
    settings: { type: Boolean, default: false }
  },
  
  // اطلاعات پرسنلی (برای همکاران)
  personnelNumber: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);