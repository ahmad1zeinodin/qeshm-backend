import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  nationalId: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker', 'business', 'admin', 'reporter'], default: 'client' },
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
