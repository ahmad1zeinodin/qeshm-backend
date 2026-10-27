import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true }, // نام مهارت (مثلاً تعمیر یخچال)
  category: { type: String, required: true }, // دسته اصلی (مثلاً تعمیرات لوازم خانگی)
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Skill', skillSchema);
