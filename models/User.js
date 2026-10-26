import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, default: null },
  phone: { type: String, sparse: true },
  whatsappNumber: String,
  passwordHash: { type: String, required: true },
  reporterBalance: { type: Number, default: 0 },
  adminPermissions: {
    orders: { type: Boolean, default: false },
    finance: { type: Boolean, default: false },
    news: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    vendors: { type: Boolean, default: false },
  },
  role: { type: String, enum: ['client', 'worker', 'business', 'admin', 'reporter'], required: true },
  idNumber: String,
  idVerified: { type: Boolean, default: false },
  idPhotoFront: String,
  idPhotoBack: String,
  idSubmitted: { type: Boolean, default: false },
  profilePhoto: String,
  location: {
    district: String,
    province: String,
  },
  socialLinks: {
    facebook:  String,
    instagram: String,
    youtube:   String,
    tiktok:    String,
    linkedin:  String,
    whatsapp:  String,
    website:   String,
  },
  resetPasswordToken:  { type: String, default: null },
  resetPasswordExpiry: { type: Date,   default: null },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
