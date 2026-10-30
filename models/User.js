import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker', 'admin', 'support', 'employee'], default: 'client' },
  
  profilePhoto: { type: String, default: '' },
  bio: { type: String, default: '' },
  nationalId: { type: String, default: '' },
  sheba: { type: String, default: '' },
  emergencyPhone: { type: String, default: '' },
  adminBadgeText: { type: String, default: '' },
  maritalStatus: { type: String, enum: ['single', 'married', ''], default: '' },
  
  documents: {
    nationalCardPhoto: { type: String, default: '' },
    birthCertificatePhoto: { type: String, default: '' },
    businessLicense: { type: String, default: '' },
    skillCertificate: { type: String, default: '' },
  },

  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'none'], default: 'none' },
  verificationTrackId: { type: String, default: '' },
  
  mainField: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isOnline: { type: Boolean, default: false },
  
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
  
  personnelNumber: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  
  // ✅ فیلدهای جدید برای کد یکبار مصرف
  otpCode: { type: String },
  otpExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);