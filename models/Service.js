import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // مثلاً تعمیر یخچال
  description: { type: String, default: '' },
  price: { type: Number, required: true }, // قیمت پایه (می‌تونه توافقی باشه)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Service', serviceSchema);
