import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true }, // نام مهارت (مثلاً تعمیر یخچال)
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // اتصال به شاخه
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Skill', skillSchema);
