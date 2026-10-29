import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // نام زیرشاخه (مثلاً تعمیرات لوازم خانگی)
  mainField: { type: String, required: true }, // فیلد اصلی (مثلاً خدمات، فروشگاه)
  icon: { type: String, default: '' },
  depositAmount: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 0 },
  showTax: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Category', categorySchema);