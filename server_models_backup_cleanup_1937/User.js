import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  nationalId: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker', 'business', 'admin', 'reporter'], default: 'client' },
  adminRoleTitle: { type: String, default: '' }, // عنوان سمت (مثلاً مدیر مالی)
  adminPermissions: {
    dashboard: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    vendors: { type: Boolean, default: false },
    addVendor: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    tickets: { type: Boolean, default: false },
  },
  accessStart: { type: Date, default: Date.now },
  accessEnd: { type: Date },
  gender: { type: String, enum: ['male', 'female'], default: 'male' }, // فیلد جنسیت
  isOnline: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  acceptanceRate: { type: Number, default: 100 },
  totalOffers: { type: Number, default: 0 },
  acceptedOffers: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  profilePhoto: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
